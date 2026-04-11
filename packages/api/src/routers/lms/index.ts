import { router } from '../../trpc';
import { lmsEnrollmentRouter } from './enrollment';
import { lmsLessonRouter } from './lesson';
import { lmsQuizRouter } from './quiz';
import { lmsRoadmapRouter } from './roadmap';
import { lmsCertificationRouter } from './certification';
import { lmsResourceRouter } from './resource';
import { lmsEntitlementRouter } from './entitlement';
import { lmsCommunityRouter } from './community';

export const lmsRouter = router({
  enrollment: lmsEnrollmentRouter,
  lesson: lmsLessonRouter,
  quiz: lmsQuizRouter,
  roadmap: lmsRoadmapRouter,
  certification: lmsCertificationRouter,
  resource: lmsResourceRouter,
  entitlement: lmsEntitlementRouter,
  community: lmsCommunityRouter,
});
