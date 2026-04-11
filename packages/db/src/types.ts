import { Timestamp } from 'firebase-admin/firestore';

// ============ ENUMS ============

export type Role = 'CONSUMER' | 'TRAINER' | 'ADMIN';
export type ConnectStatus = 'PENDING' | 'ACTIVE' | 'DISABLED';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type LeaderboardTier = 'PUP' | 'HANDLER' | 'TRAINER_TIER' | 'COACH' | 'PRO' | 'MASTER' | 'LEGEND' | 'CHAMPION';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'EXERCISE';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type ContentType = 'COURSE' | 'MODULE' | 'LESSON' | 'PRODUCT';
export type GrantSource = 'PURCHASE' | 'SUBSCRIPTION' | 'ADMIN_GRANT' | 'PROMO_CODE';
export type Decision = 'PROGRESS' | 'REPEAT' | 'VARIATION' | 'REGRESS' | 'REGULATION_TRAINING';
export type NotificationType = 'LEVEL_UP' | 'STREAK_REMINDER' | 'STREAK_LOST' | 'QUEST_COMPLETE' | 'BADGE_EARNED' | 'FRIEND_REQUEST' | 'LEADERBOARD_PROMOTION' | 'LEADERBOARD_DEMOTION' | 'LEADERBOARD_AT_RISK' | 'SEASON_START' | 'SEASON_END' | 'INACTIVITY_NUDGE' | 'PURCHASE_CONFIRMATION' | 'GENERAL';

// ============ CORE MODELS ============

export interface User {
  id: string;
  clerkId?: string;
  firebaseUid?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  role: Role;
  bio?: string;
  phone?: string;
  location?: string;
  stripeCustomerId?: string;
  stripeConnectAccountId?: string;
  stripeConnectStatus?: ConnectStatus;
  totalXP: number;
  totalGems: number;
  profileVisibility?: Record<string, boolean>;
  // Trainer-specific
  trainerSpecializations?: string[];
  trainerCertifications?: string[];
  yearsExperience?: number;
  businessName?: string;
  websiteUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Dog {
  id: string;
  userId: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  photoUrl?: string;
  temperament?: string;
  trainingGoals: string[];
  experienceLevel: ExperienceLevel;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Timestamp;
  streakStartDate?: Timestamp;
  currentCGPS?: number;
  leaderboardTier: LeaderboardTier;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Course {
  id: string;
  trainerId?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  category?: string;
  difficulty: Difficulty;
  status: ContentStatus;
  isProblemCourse: boolean;
  price: number;
  salePrice?: number;
  averageRating?: number;
  studentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  content?: Record<string, any>;
  videoUrl?: string;
  duration?: number;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId?: string;
  stripePaymentId?: string;
  amount: number;
  platformFee?: number;
  trainerPayout?: number;
  status: PaymentStatus;
  createdAt: Timestamp;
}

export interface Entitlement {
  id: string;
  userId: string;
  courseId?: string;
  contentType: ContentType;
  contentId: string;
  grantedBy: GrantSource;
  isActive: boolean;
  expiresAt?: Timestamp;
  grantedAt: Timestamp;
}

export interface TrainingSession {
  id: string;
  userId: string;
  dogId: string;
  lessonId?: string;
  environmentType?: string;
  performanceScore?: number;
  regulationScore?: number;
  environmentScore?: number;
  consistencyScore?: number;
  cgpsTotal?: number;
  successRate?: number;
  duration?: number;
  decision?: Decision;
  decisionReason?: string;
  xpEarned: number;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title?: string;
  body?: string;
  trainerResponse?: string;
  helpfulCount: number;
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Timestamp;
}
