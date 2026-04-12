import { FirestoreDataConverter } from 'firebase-admin/firestore';
import { db } from './firebase';
import {
  User,
  Dog,
  Course,
  Module,
  Lesson,
  Purchase,
  Entitlement,
  TrainingSession,
  Review,
  Notification,
} from './types';

// Helper to create a Firestore converter for any type
function createConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: T) => data as FirebaseFirestore.DocumentData,
    fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }) as unknown as T,
  };
}

// Collection references
export const collections = {
  users: db.collection('users').withConverter(createConverter<User>()),
  dogs: db.collection('dogs').withConverter(createConverter<Dog>()),
  courses: db.collection('courses').withConverter(createConverter<Course>()),
  modules: db.collection('modules').withConverter(createConverter<Module>()),
  lessons: db.collection('lessons').withConverter(createConverter<Lesson>()),
  purchases: db.collection('purchases').withConverter(createConverter<Purchase>()),
  entitlements: db.collection('entitlements').withConverter(createConverter<Entitlement>()),
  trainingSessions: db.collection('trainingSessions').withConverter(createConverter<TrainingSession>()),
  reviews: db.collection('reviews').withConverter(createConverter<Review>()),
  notifications: db.collection('notifications').withConverter(createConverter<Notification>()),
  supportTickets: db.collection('supportTickets'),
  platformConfig: db.collection('platformConfig'),
  // Leaderboard
  leaderboardConfig: db.collection('leaderboardConfig'),
  seasons: db.collection('seasons'),
  divisions: db.collection('divisions'),
  divisionMemberships: db.collection('divisionMemberships'),
  leaderboardXPEvents: db.collection('leaderboardXPEvents'),
  weeklySnapshots: db.collection('weeklySnapshots'),
  // Gamification
  badges: db.collection('badges'),
  userBadges: db.collection('userBadges'),
  xpTransactions: db.collection('xpTransactions'),
  quests: db.collection('quests'),
  userQuests: db.collection('userQuests'),
  gemTransactions: db.collection('gemTransactions'),
  // Funnels
  funnels: db.collection('funnels'),
  funnelPages: db.collection('funnelPages'),
  funnelBlocks: db.collection('funnelBlocks'),
  funnelLeads: db.collection('funnelLeads'),
  // CRM & Marketing
  contacts: db.collection('contacts'),
  emailCampaigns: db.collection('emailCampaigns'),
  emailSequences: db.collection('emailSequences'),
  // Friends
  friendLinks: db.collection('friendLinks'),
  // LMS
  lmsEnrollments: db.collection('lmsEnrollments'),
  lmsLessonProgress: db.collection('lmsLessonProgress'),
  lmsQuizzes: db.collection('lmsQuizzes'),
  lmsQuizQuestions: db.collection('lmsQuizQuestions'),
  lmsQuizAttempts: db.collection('lmsQuizAttempts'),
  lmsRoadmaps: db.collection('lmsRoadmaps'),
  lmsRoadmapSteps: db.collection('lmsRoadmapSteps'),
  lmsUserRoadmapProgress: db.collection('lmsUserRoadmapProgress'),
  lmsUserRoadmapStepProgress: db.collection('lmsUserRoadmapStepProgress'),
  lmsCertifications: db.collection('lmsCertifications'),
  lmsCertCourses: db.collection('lmsCertCourses'),
  lmsCertCandidacies: db.collection('lmsCertCandidacies'),
  lmsResources: db.collection('lmsResources'),
  lmsLessonResources: db.collection('lmsLessonResources'),
  lmsProducts: db.collection('lmsProducts'),
  lmsProductCourseAccess: db.collection('lmsProductCourseAccess'),
  lmsProductCertAccess: db.collection('lmsProductCertAccess'),
  lmsProductRoadmapAccess: db.collection('lmsProductRoadmapAccess'),
  lmsUserEntitlements: db.collection('lmsUserEntitlements'),
  lmsAnnouncements: db.collection('lmsAnnouncements'),
  lmsCommunityLinks: db.collection('lmsCommunityLinks'),
};

// Helper to get a subcollection
export function subcollection(parentCollection: string, parentId: string, subCollection: string) {
  return db.collection(parentCollection).doc(parentId).collection(subCollection);
}
