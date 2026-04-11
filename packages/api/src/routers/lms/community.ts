import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsCommunityRouter = router({
  // Get published announcements
  getAnnouncements: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const { limit = 10, cursor } = input ?? {};

      // Query pinned announcements first
      const pinnedSnapshot = await collections.lmsAnnouncements
        .where('status', '==', 'PUBLISHED')
        .where('isPinned', '==', true)
        .orderBy('publishedAt', 'desc')
        .get();

      const pinnedAnnouncements = pinnedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Query unpinned announcements
      let unpinnedQuery = collections.lmsAnnouncements
        .where('status', '==', 'PUBLISHED')
        .where('isPinned', '==', false)
        .orderBy('publishedAt', 'desc')
        .limit(limit + 1);

      // Handle cursor for pagination (cursor-based, starting after the last doc)
      if (cursor && !pinnedAnnouncements.find(a => a.id === cursor)) {
        // Find the cursor document to use as startAfter point
        const cursorDoc = await collections.lmsAnnouncements.doc(cursor).get();
        if (cursorDoc.exists) {
          unpinnedQuery = unpinnedQuery.startAfter(cursorDoc);
        }
      }

      const unpinnedSnapshot = await unpinnedQuery.get();
      let unpinnedAnnouncements = unpinnedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine and slice to limit
      let announcements = [...pinnedAnnouncements, ...unpinnedAnnouncements.slice(0, limit)];
      announcements = announcements.slice(0, limit);

      // Determine next cursor
      let nextCursor: string | undefined;
      if (unpinnedSnapshot.docs.length > limit) {
        const nextDoc = unpinnedSnapshot.docs[limit];
        nextCursor = nextDoc.id;
      }

      return { announcements, nextCursor };
    }),

  // Get community links
  getCommunityLinks: protectedProcedure.query(async () => {
    const snapshot = await collections.lmsCommunityLinks
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }),

  // Admin: create announcement
  adminCreateAnnouncement: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      isPinned: z.boolean().default(false),
      publishNow: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const publishedAt = input.publishNow ? Timestamp.now() : null;

      const docRef = await collections.lmsAnnouncements.add({
        title: input.title,
        content: input.content,
        authorId: ctx.userId,
        isPinned: input.isPinned,
        status: input.publishNow ? 'PUBLISHED' : 'DRAFT',
        publishedAt,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),

  // Admin: update announcement
  adminUpdateAnnouncement: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      isPinned: z.boolean().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, status, ...data } = input;

      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      if (status) {
        updateData.status = status;
        updateData.publishedAt = status === 'PUBLISHED' ? Timestamp.now() : null;
      }

      await collections.lmsAnnouncements.doc(id).update(updateData);
      const doc = await collections.lmsAnnouncements.doc(id).get();
      return { id: doc.id, ...doc.data() };
    }),

  // Admin: create community link
  adminCreateLink: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      url: z.string().url(),
      iconUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Get max sortOrder
      const linksSnapshot = await collections.lmsCommunityLinks
        .orderBy('sortOrder', 'desc')
        .limit(1)
        .get();

      let maxSort = 0;
      if (!linksSnapshot.empty) {
        maxSort = linksSnapshot.docs[0].data().sortOrder ?? 0;
      }

      const docRef = await collections.lmsCommunityLinks.add({
        ...input,
        isActive: true,
        sortOrder: maxSort + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),

  // Admin: update community link
  adminUpdateLink: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      url: z.string().url().optional(),
      iconUrl: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await collections.lmsCommunityLinks.doc(id).update(updateData);
      const doc = await collections.lmsCommunityLinks.doc(id).get();
      return { id: doc.id, ...doc.data() };
    }),
});
