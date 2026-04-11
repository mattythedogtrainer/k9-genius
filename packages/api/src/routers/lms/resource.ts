import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsResourceRouter = router({
  // Get accessible resources for current user
  getResources: protectedProcedure
    .input(z.object({
      type: z.enum(['PDF', 'WORKSHEET', 'TEMPLATE', 'AUDIO', 'CHECKLIST', 'GUIDE', 'EXTERNAL_LINK', 'OTHER']).optional(),
      tag: z.string().optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ input }) => {
      const { type, tag, search, page = 1, limit = 20 } = input ?? {};

      // Build base query for published global resources
      let query = collections.lmsResources.where('status', '==', 'PUBLISHED').where('isGlobal', '==', true);

      // Add type filter
      if (type) {
        query = query.where('type', '==', type);
      }

      // Get total count
      const totalSnapshot = await query.get();
      let allResources = totalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter by tag (array-contains)
      if (tag) {
        allResources = allResources.filter(r => Array.isArray(r.tags) && r.tags.includes(tag));
      }

      // Filter by search (in-memory, case-insensitive)
      if (search) {
        const searchLower = search.toLowerCase();
        allResources = allResources.filter(r =>
          (r.title && r.title.toLowerCase().includes(searchLower)) ||
          (r.description && r.description.toLowerCase().includes(searchLower))
        );
      }

      // Get total before pagination
      const total = allResources.length;

      // Sort by createdAt descending
      allResources.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
        const bTime = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });

      // Pagination
      const start = (page - 1) * limit;
      const resources = allResources.slice(start, start + limit);

      return { resources, total, page, totalPages: Math.ceil(total / limit) };
    }),

  // Admin: create resource
  adminCreate: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(['PDF', 'WORKSHEET', 'TEMPLATE', 'AUDIO', 'CHECKLIST', 'GUIDE', 'EXTERNAL_LINK', 'OTHER']),
      fileUrl: z.string().optional(),
      externalUrl: z.string().optional(),
      fileSizeBytes: z.number().optional(),
      mimeType: z.string().optional(),
      isGlobal: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
    }))
    .mutation(async ({ input }) => {
      const { tags, ...data } = input;
      const docRef = await collections.lmsResources.add({
        ...data,
        tags: tags,
        status: 'PUBLISHED',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),
});
