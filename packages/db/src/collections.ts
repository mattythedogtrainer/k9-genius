import { db } from './firebase';

// Collection references
export const collections = {
  users: db.collection('users'),
  dogs: db.collection('dogs'),
  courses: db.collection('courses'),
  modules: db.collection('modules'),
  lessons: db.collection('lessons'),
  purchases: db.collection('purchases'),
  entitlements: db.collection('entitlements'),
  trainingSessions: db.collection('trainingSessions'),
  reviews: db.collection('reviews'),
  notifications: db.collection('notifications'),
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
