'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@k9-genius/ui';
import {
  clientDb,
  collection,
  doc,
  setDoc,
  Timestamp,
  getDocs,
  query,
  limit,
} from '@k9-genius/db/client';

// ============================================================
// SEED DATA
// ============================================================

const now = Timestamp.now();

const COURSES = [
  {
    id: 'course-behavior-basics',
    title: 'Foundation Course: Canine Behavior Basics',
    description: 'Master the core principles of canine behavior science and the K9 Genius approach to understanding dogs. This comprehensive course covers body language, communication signals, learning theory, and the foundations of positive reinforcement training.',
    category: 'Behavior',
    difficulty: 'BEGINNER',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 0,
    studentCount: 1240,
    averageRating: 4.8,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-advanced-obedience',
    title: 'Advanced Obedience Training',
    description: 'Take your obedience training to the next level with advanced commands, off-leash reliability, and competition preparation. Learn distance control, directed retrieves, and precision heeling techniques.',
    category: 'Obedience',
    difficulty: 'ADVANCED',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 29,
    studentCount: 856,
    averageRating: 4.9,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-puppy-development',
    title: 'Puppy Development & Early Learning',
    description: 'Comprehensive puppy training covering developmental stages, critical socialization windows, and foundation behaviors. Build a confident, well-adjusted companion from the start.',
    category: 'Puppy Training',
    difficulty: 'BEGINNER',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 0,
    studentCount: 2100,
    averageRating: 4.7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-agility-fundamentals',
    title: 'Agility Fundamentals',
    description: 'Build confidence and coordination through foundational agility exercises. Learn obstacle introduction, sequencing basics, and handler movement patterns.',
    category: 'Agility',
    difficulty: 'BEGINNER',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 19,
    studentCount: 920,
    averageRating: 4.6,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-reactivity-management',
    title: 'Advanced Reactivity Management',
    description: 'Learn evidence-based protocols for managing and reducing reactivity in dogs of all breeds. Covers desensitization, counter-conditioning, and management strategies.',
    category: 'Behavior',
    difficulty: 'ADVANCED',
    status: 'PUBLISHED',
    isProblemCourse: true,
    price: 39,
    studentCount: 645,
    averageRating: 4.9,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-service-dog-foundation',
    title: 'Service Dog Foundation Training',
    description: 'Essential skills and public access training for service dog candidates and their handlers. Covers task training, public behavior, and legal rights.',
    category: 'Service Dogs',
    difficulty: 'INTERMEDIATE',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 49,
    studentCount: 410,
    averageRating: 4.8,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-therapy-dog-prep',
    title: 'Therapy Dog Certification Prep',
    description: 'Prepare your dog for therapy work certification with temperament evaluation, handler training, and real-world scenario practice.',
    category: 'Therapy Dogs',
    difficulty: 'INTERMEDIATE',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 29,
    studentCount: 578,
    averageRating: 4.5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-puppy-socialization',
    title: 'Puppy Socialization Masterclass',
    description: 'Critical period socialization protocols to build confident, well-adjusted adult dogs. Learn safe exposure techniques and fear prevention strategies.',
    category: 'Puppy Training',
    difficulty: 'BEGINNER',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 0,
    studentCount: 1580,
    averageRating: 4.8,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'course-competitive-agility',
    title: 'Competitive Agility Mastery',
    description: 'Advanced course sequencing, speed training, and competition strategies for agility enthusiasts pursuing titles and ribbons.',
    category: 'Agility',
    difficulty: 'ADVANCED',
    status: 'PUBLISHED',
    isProblemCourse: false,
    price: 39,
    studentCount: 320,
    averageRating: 4.7,
    createdAt: now,
    updatedAt: now,
  },
];

// Modules and lessons for each course
const COURSE_CONTENT: Record<string, { modules: { id: string; title: string; description: string; sortOrder: number; lessons: { id: string; title: string; type: string; duration: number; sortOrder: number; content: Record<string, string> }[] }[] }> = {
  'course-behavior-basics': {
    modules: [
      {
        id: 'mod-bb-1', title: 'Understanding Canine Communication', description: 'Learn to read and interpret dog body language and vocal signals.', sortOrder: 1,
        lessons: [
          { id: 'les-bb-1-1', title: 'Introduction to Canine Body Language', type: 'VIDEO', duration: 1200, sortOrder: 1, content: { text: 'Dogs communicate primarily through body language. In this lesson, we explore the key signals including tail position, ear orientation, body posture, and facial expressions that reveal a dog\'s emotional state.' } },
          { id: 'les-bb-1-2', title: 'Calming Signals & Stress Indicators', type: 'VIDEO', duration: 900, sortOrder: 2, content: { text: 'Turid Rugaas identified over 30 calming signals dogs use to communicate peaceful intent. Learn to spot lip licking, yawning, head turning, and other subtle stress signals.' } },
          { id: 'les-bb-1-3', title: 'Vocal Communication: Barks, Whines & Growls', type: 'TEXT', duration: 600, sortOrder: 3, content: { text: 'Different types of vocalizations carry different meanings. A high-pitched bark differs from a low guttural bark. Understanding these distinctions helps trainers respond appropriately.' } },
          { id: 'les-bb-1-4', title: 'Quiz: Reading Body Language', type: 'QUIZ', duration: 300, sortOrder: 4, content: { text: 'Test your knowledge of canine body language signals.' } },
        ],
      },
      {
        id: 'mod-bb-2', title: 'Learning Theory Foundations', description: 'Core principles of how dogs learn and retain information.', sortOrder: 2,
        lessons: [
          { id: 'les-bb-2-1', title: 'Classical Conditioning Explained', type: 'VIDEO', duration: 1500, sortOrder: 1, content: { text: 'Classical conditioning, first described by Pavlov, is the foundation of emotional learning in dogs. Understand how associations form and how to use this knowledge in training.' } },
          { id: 'les-bb-2-2', title: 'Operant Conditioning: The Four Quadrants', type: 'VIDEO', duration: 1200, sortOrder: 2, content: { text: 'Explore positive reinforcement, negative reinforcement, positive punishment, and negative punishment. Learn why the K9 Genius method emphasizes R+ training.' } },
          { id: 'les-bb-2-3', title: 'Shaping & Capturing Behaviors', type: 'TEXT', duration: 900, sortOrder: 3, content: { text: 'Shaping breaks complex behaviors into small achievable steps. Capturing marks and rewards naturally offered behaviors. Both are powerful tools for building new skills.' } },
          { id: 'les-bb-2-4', title: 'Reinforcement Schedules & Timing', type: 'VIDEO', duration: 1100, sortOrder: 4, content: { text: 'The timing and schedule of reinforcement dramatically affects learning speed and behavior durability. Learn about continuous vs intermittent schedules.' } },
        ],
      },
      {
        id: 'mod-bb-3', title: 'Positive Reinforcement Techniques', description: 'Practical application of reward-based training methods.', sortOrder: 3,
        lessons: [
          { id: 'les-bb-3-1', title: 'Marker Training Fundamentals', type: 'VIDEO', duration: 1000, sortOrder: 1, content: { text: 'A marker (clicker or verbal) bridges the gap between desired behavior and reward delivery. Learn proper marker introduction and charging protocols.' } },
          { id: 'les-bb-3-2', title: 'Treat Selection & Reward Hierarchies', type: 'TEXT', duration: 600, sortOrder: 2, content: { text: 'Not all rewards are created equal. Build a reward hierarchy from kibble to high-value treats and learn when to use each level.' } },
          { id: 'les-bb-3-3', title: 'Lure-Reward Training vs Free Shaping', type: 'VIDEO', duration: 1300, sortOrder: 3, content: { text: 'Compare lure-based methods with free shaping approaches. Each has strengths depending on the behavior being trained and the dog\'s temperament.' } },
          { id: 'les-bb-3-4', title: 'Building Duration, Distance & Distraction', type: 'VIDEO', duration: 1400, sortOrder: 4, content: { text: 'The three Ds are the pillars of reliable behavior. Learn how to systematically increase criteria without frustrating the learner.' } },
        ],
      },
      {
        id: 'mod-bb-4', title: 'Behavior Assessment', description: 'How to evaluate and document canine behavior.', sortOrder: 4,
        lessons: [
          { id: 'les-bb-4-1', title: 'Conducting a Behavior Assessment', type: 'VIDEO', duration: 1200, sortOrder: 1, content: { text: 'A structured behavior assessment is the first step in any training program. Learn the K9 Genius assessment protocol for new clients.' } },
          { id: 'les-bb-4-2', title: 'Identifying Triggers & Thresholds', type: 'TEXT', duration: 800, sortOrder: 2, content: { text: 'Understanding what triggers a behavioral response and where a dog\'s threshold lies is critical for building effective modification plans.' } },
          { id: 'les-bb-4-3', title: 'Creating a Training Plan', type: 'VIDEO', duration: 1500, sortOrder: 3, content: { text: 'Translate assessment findings into actionable, measurable training goals. Structure a plan that builds on small wins.' } },
          { id: 'les-bb-4-4', title: 'Module Assessment', type: 'QUIZ', duration: 300, sortOrder: 4, content: { text: 'Final assessment covering all behavior fundamentals.' } },
        ],
      },
    ],
  },
  'course-advanced-obedience': {
    modules: [
      {
        id: 'mod-ao-1', title: 'Precision Heeling', description: 'Master competition-level heeling techniques.', sortOrder: 1,
        lessons: [
          { id: 'les-ao-1-1', title: 'Foundation Position & Engagement', type: 'VIDEO', duration: 1200, sortOrder: 1, content: { text: 'The heel position is the cornerstone of competitive obedience. Build engagement and proper positioning through reward placement and movement patterns.' } },
          { id: 'les-ao-1-2', title: 'Pace Changes & Turns', type: 'VIDEO', duration: 1100, sortOrder: 2, content: { text: 'Smooth transitions between normal, slow, and fast paces. Master left turns, right turns, about turns, and figure eights.' } },
          { id: 'les-ao-1-3', title: 'Distraction Proofing Your Heel', type: 'VIDEO', duration: 900, sortOrder: 3, content: { text: 'Systematically introduce distractions while maintaining heel position quality. Build focus through environmental challenges.' } },
        ],
      },
      {
        id: 'mod-ao-2', title: 'Distance Control', description: 'Reliable commands at distance.', sortOrder: 2,
        lessons: [
          { id: 'les-ao-2-1', title: 'Building Distance with Sits & Downs', type: 'VIDEO', duration: 1300, sortOrder: 1, content: { text: 'Gradually increase the distance between handler and dog while maintaining reliable responses to sit, down, and stand commands.' } },
          { id: 'les-ao-2-2', title: 'Signal Exercises', type: 'VIDEO', duration: 1000, sortOrder: 2, content: { text: 'Replace verbal commands with hand signals for utility-level obedience exercises.' } },
          { id: 'les-ao-2-3', title: 'Directed Jumping', type: 'VIDEO', duration: 1200, sortOrder: 3, content: { text: 'Teach your dog to take direction to specific jumps from a distance — a key utility exercise.' } },
        ],
      },
      {
        id: 'mod-ao-3', title: 'Retrieves & Scent Work', description: 'Advanced retrieve exercises and scent discrimination.', sortOrder: 3,
        lessons: [
          { id: 'les-ao-3-1', title: 'Formal Retrieve on Flat', type: 'VIDEO', duration: 1100, sortOrder: 1, content: { text: 'Build a polished retrieve with proper sit-front presentation and finish.' } },
          { id: 'les-ao-3-2', title: 'Retrieve Over High Jump', type: 'VIDEO', duration: 1000, sortOrder: 2, content: { text: 'Combine the retrieve with jumping skills for open-level obedience.' } },
          { id: 'les-ao-3-3', title: 'Scent Discrimination Articles', type: 'VIDEO', duration: 1400, sortOrder: 3, content: { text: 'Teach scent discrimination using leather and metal articles for utility work.' } },
        ],
      },
    ],
  },
  'course-puppy-development': {
    modules: [
      {
        id: 'mod-pd-1', title: 'Developmental Stages', description: 'Understanding puppy growth phases.', sortOrder: 1,
        lessons: [
          { id: 'les-pd-1-1', title: 'Neonatal & Transitional Periods', type: 'VIDEO', duration: 900, sortOrder: 1, content: { text: 'The first weeks of life set the foundation. Understand neurological development and early handling protocols.' } },
          { id: 'les-pd-1-2', title: 'The Critical Socialization Window', type: 'VIDEO', duration: 1200, sortOrder: 2, content: { text: 'Between 3-14 weeks, puppies form lasting impressions about their world. Learn how to maximize this window safely.' } },
          { id: 'les-pd-1-3', title: 'Fear Periods & How to Navigate Them', type: 'TEXT', duration: 800, sortOrder: 3, content: { text: 'Puppies go through multiple fear periods. Recognize the signs and adjust your training approach accordingly.' } },
        ],
      },
      {
        id: 'mod-pd-2', title: 'Foundation Behaviors', description: 'Essential puppy skills for life.', sortOrder: 2,
        lessons: [
          { id: 'les-pd-2-1', title: 'Name Recognition & Engagement', type: 'VIDEO', duration: 800, sortOrder: 1, content: { text: 'Teaching your puppy to respond to their name is the first and most important behavior to train.' } },
          { id: 'les-pd-2-2', title: 'Sit, Down & Wait', type: 'VIDEO', duration: 1000, sortOrder: 2, content: { text: 'Build reliable basic commands using lure-reward methods appropriate for young puppies.' } },
          { id: 'les-pd-2-3', title: 'Recall Games', type: 'VIDEO', duration: 900, sortOrder: 3, content: { text: 'Start building a reliable recall early with fun chase games and high-value rewards.' } },
          { id: 'les-pd-2-4', title: 'Leash Introduction', type: 'VIDEO', duration: 700, sortOrder: 4, content: { text: 'Introduce collar, harness, and leash as positive experiences before formal leash walking.' } },
        ],
      },
      {
        id: 'mod-pd-3', title: 'House Training & Management', description: 'Potty training and prevention of problem behaviors.', sortOrder: 3,
        lessons: [
          { id: 'les-pd-3-1', title: 'Crate Training Done Right', type: 'VIDEO', duration: 1100, sortOrder: 1, content: { text: 'The crate should be a safe haven, not a prison. Learn gradual introduction and positive association protocols.' } },
          { id: 'les-pd-3-2', title: 'House Training Schedule & Protocols', type: 'TEXT', duration: 600, sortOrder: 2, content: { text: 'A consistent schedule is the key to potty training success. Set up management and supervision systems.' } },
          { id: 'les-pd-3-3', title: 'Bite Inhibition & Mouthing', type: 'VIDEO', duration: 900, sortOrder: 3, content: { text: 'Puppies explore with their mouths. Teach appropriate bite pressure and redirect mouthing to appropriate items.' } },
        ],
      },
    ],
  },
  'course-agility-fundamentals': {
    modules: [
      {
        id: 'mod-af-1', title: 'Getting Started with Agility', description: 'Foundation skills for handler and dog.', sortOrder: 1,
        lessons: [
          { id: 'les-af-1-1', title: 'Handler Movement Basics', type: 'VIDEO', duration: 1000, sortOrder: 1, content: { text: 'Your movement tells your dog where to go. Learn front crosses, rear crosses, and blind crosses.' } },
          { id: 'les-af-1-2', title: 'Obstacle Introduction: Jumps', type: 'VIDEO', duration: 900, sortOrder: 2, content: { text: 'Start with low bars and build confidence. Teach commitment to obstacles and proper jumping form.' } },
          { id: 'les-af-1-3', title: 'Tunnel Training', type: 'VIDEO', duration: 800, sortOrder: 3, content: { text: 'Most dogs love tunnels. Build speed and confidence through straight and curved tunnels.' } },
        ],
      },
      {
        id: 'mod-af-2', title: 'Contact Obstacles', description: 'A-frame, dog walk, and teeter.', sortOrder: 2,
        lessons: [
          { id: 'les-af-2-1', title: 'A-Frame Introduction', type: 'VIDEO', duration: 1100, sortOrder: 1, content: { text: 'Teach safe and confident A-frame performance with proper contact zone behavior.' } },
          { id: 'les-af-2-2', title: 'Dog Walk Confidence', type: 'VIDEO', duration: 1000, sortOrder: 2, content: { text: 'Build balance and confidence on the narrow dog walk. Address fear and speed issues.' } },
          { id: 'les-af-2-3', title: 'Teeter Training', type: 'VIDEO', duration: 1200, sortOrder: 3, content: { text: 'The teeter is often the scariest obstacle. Use systematic desensitization and reward placement.' } },
        ],
      },
    ],
  },
  'course-reactivity-management': {
    modules: [
      {
        id: 'mod-rm-1', title: 'Understanding Reactivity', description: 'What causes reactivity and how to assess it.', sortOrder: 1,
        lessons: [
          { id: 'les-rm-1-1', title: 'What Is Reactivity?', type: 'VIDEO', duration: 1200, sortOrder: 1, content: { text: 'Reactivity is an over-response to normal stimuli. Understand the difference between reactivity, aggression, and fear responses.' } },
          { id: 'les-rm-1-2', title: 'Identifying Triggers & Patterns', type: 'VIDEO', duration: 1000, sortOrder: 2, content: { text: 'Keep a detailed trigger diary. Identify distance thresholds, trigger stacking, and environmental factors.' } },
          { id: 'les-rm-1-3', title: 'The Stress Bucket Model', type: 'TEXT', duration: 700, sortOrder: 3, content: { text: 'Every dog has a stress capacity. Understanding how daily stressors accumulate helps prevent reactive episodes.' } },
        ],
      },
      {
        id: 'mod-rm-2', title: 'Modification Protocols', description: 'Evidence-based behavior modification techniques.', sortOrder: 2,
        lessons: [
          { id: 'les-rm-2-1', title: 'Desensitization & Counter-Conditioning', type: 'VIDEO', duration: 1500, sortOrder: 1, content: { text: 'The gold standard for behavior modification. Learn proper sub-threshold exposure paired with positive associations.' } },
          { id: 'les-rm-2-2', title: 'BAT 2.0 Protocol', type: 'VIDEO', duration: 1300, sortOrder: 2, content: { text: 'Behavior Adjustment Training gives the dog agency in managing their own distance from triggers.' } },
          { id: 'les-rm-2-3', title: 'Emergency Management Strategies', type: 'VIDEO', duration: 900, sortOrder: 3, content: { text: 'When you encounter triggers unexpectedly: U-turns, scatter feeding, find-it games, and barrier strategies.' } },
          { id: 'les-rm-2-4', title: 'Building a Long-Term Plan', type: 'TEXT', duration: 800, sortOrder: 4, content: { text: 'Reactivity modification is a marathon, not a sprint. Set realistic milestones and track progress.' } },
        ],
      },
    ],
  },
  'course-service-dog-foundation': {
    modules: [
      {
        id: 'mod-sd-1', title: 'Service Dog Basics', description: 'Legal rights, selection criteria, and training foundations.', sortOrder: 1,
        lessons: [
          { id: 'les-sd-1-1', title: 'ADA Rights & Responsibilities', type: 'TEXT', duration: 900, sortOrder: 1, content: { text: 'Understanding the Americans with Disabilities Act and how it applies to service dog teams.' } },
          { id: 'les-sd-1-2', title: 'Candidate Evaluation', type: 'VIDEO', duration: 1200, sortOrder: 2, content: { text: 'Not every dog is suited for service work. Learn the temperament and behavioral criteria for selection.' } },
          { id: 'les-sd-1-3', title: 'Foundation Task Training', type: 'VIDEO', duration: 1400, sortOrder: 3, content: { text: 'Build the foundation skills that all service dogs need regardless of their specific task work.' } },
        ],
      },
      {
        id: 'mod-sd-2', title: 'Public Access Training', description: 'Preparing for real-world public environments.', sortOrder: 2,
        lessons: [
          { id: 'les-sd-2-1', title: 'Settling in Public Spaces', type: 'VIDEO', duration: 1100, sortOrder: 1, content: { text: 'Teaching a reliable settle/down-stay in restaurants, stores, and other public environments.' } },
          { id: 'les-sd-2-2', title: 'Distraction Training for Public Access', type: 'VIDEO', duration: 1300, sortOrder: 2, content: { text: 'Service dogs must ignore food, other animals, people, and noise. Build unshakeable focus.' } },
          { id: 'les-sd-2-3', title: 'Public Access Test Preparation', type: 'VIDEO', duration: 1000, sortOrder: 3, content: { text: 'Walk through the standard public access test criteria and practice each element.' } },
        ],
      },
    ],
  },
  'course-therapy-dog-prep': {
    modules: [
      {
        id: 'mod-td-1', title: 'Therapy Dog Fundamentals', description: 'What makes a great therapy dog team.', sortOrder: 1,
        lessons: [
          { id: 'les-td-1-1', title: 'Therapy Dog vs Service Dog', type: 'TEXT', duration: 600, sortOrder: 1, content: { text: 'Understanding the key differences between therapy dogs, service dogs, and emotional support animals.' } },
          { id: 'les-td-1-2', title: 'Temperament Requirements', type: 'VIDEO', duration: 900, sortOrder: 2, content: { text: 'Therapy dogs must be calm, friendly, and tolerant. Assess your dog for suitability.' } },
          { id: 'les-td-1-3', title: 'Handler Skills & Self-Care', type: 'TEXT', duration: 700, sortOrder: 3, content: { text: 'Therapy work can be emotionally demanding. Learn handler wellness strategies and reading room energy.' } },
        ],
      },
    ],
  },
  'course-puppy-socialization': {
    modules: [
      {
        id: 'mod-ps-1', title: 'Socialization Science', description: 'The research behind socialization protocols.', sortOrder: 1,
        lessons: [
          { id: 'les-ps-1-1', title: 'Why Socialization Matters', type: 'VIDEO', duration: 1000, sortOrder: 1, content: { text: 'Research shows that proper socialization is the single most important factor in preventing behavior problems later in life.' } },
          { id: 'les-ps-1-2', title: 'Safe Exposure Protocols', type: 'VIDEO', duration: 1200, sortOrder: 2, content: { text: 'Quality over quantity. Learn the K9 Genius approach to safe, positive exposure to new experiences.' } },
          { id: 'les-ps-1-3', title: 'Socialization Checklist', type: 'TEXT', duration: 500, sortOrder: 3, content: { text: 'A comprehensive checklist of people, places, sounds, surfaces, and experiences your puppy should encounter.' } },
        ],
      },
    ],
  },
  'course-competitive-agility': {
    modules: [
      {
        id: 'mod-ca-1', title: 'Competition Preparation', description: 'Getting ring-ready for agility trials.', sortOrder: 1,
        lessons: [
          { id: 'les-ca-1-1', title: 'Course Analysis & Walking', type: 'VIDEO', duration: 1100, sortOrder: 1, content: { text: 'Learn to analyze a course map, identify handling challenges, and walk an efficient path.' } },
          { id: 'les-ca-1-2', title: 'Speed vs Accuracy', type: 'VIDEO', duration: 1000, sortOrder: 2, content: { text: 'Finding the balance between speed and clean runs. When to push and when to prioritize accuracy.' } },
          { id: 'les-ca-1-3', title: 'Trial Day Management', type: 'TEXT', duration: 800, sortOrder: 3, content: { text: 'Managing nerves, warm-up routines, and ring procedures for your first competition.' } },
        ],
      },
    ],
  },
};

// Resources
const RESOURCES = [
  { id: 'res-body-language-chart', title: 'Canine Body Language Chart', description: 'Visual reference guide for reading dog body language signals.', type: 'PDF', fileSizeBytes: 2516582, tags: ['behavior', 'body language', 'reference'], downloadCount: 1240, status: 'PUBLISHED' },
  { id: 'res-reactivity-worksheet', title: 'Reactivity Assessment Worksheet', description: 'Structured worksheet for documenting reactive triggers and thresholds.', type: 'WORKSHEET', fileSizeBytes: 1153434, tags: ['reactivity', 'assessment', 'behavior'], downloadCount: 856, status: 'PUBLISHED' },
  { id: 'res-training-template', title: 'Training Session Template', description: 'Plan and log training sessions with goals, exercises, and outcomes.', type: 'TEMPLATE', fileSizeBytes: 838861, tags: ['training', 'planning', 'template'], downloadCount: 2100, status: 'PUBLISHED' },
  { id: 'res-socialization-checklist', title: 'Puppy Socialization Checklist', description: 'Comprehensive checklist of experiences for puppy socialization.', type: 'CHECKLIST', fileSizeBytes: 524288, tags: ['puppy', 'socialization', 'checklist'], downloadCount: 1890, status: 'PUBLISHED' },
  { id: 'res-client-intake', title: 'Client Intake Form Template', description: 'Professional intake form for new training clients.', type: 'TEMPLATE', fileSizeBytes: 629145, tags: ['professional', 'client', 'intake'], downloadCount: 1450, status: 'PUBLISHED' },
  { id: 'res-leash-handling', title: 'Leash Handling Techniques Guide', description: 'Illustrated guide to proper leash handling and communication.', type: 'PDF', fileSizeBytes: 3984588, tags: ['leash', 'handling', 'guide'], downloadCount: 920, status: 'PUBLISHED' },
  { id: 'res-fear-periods', title: 'Fear Periods Development Chart', description: 'Timeline of canine developmental fear periods with management strategies.', type: 'PDF', fileSizeBytes: 1258291, tags: ['puppy', 'fear', 'development'], downloadCount: 1100, status: 'PUBLISHED' },
  { id: 'res-progress-tracker', title: 'Training Progress Tracker', description: 'Track behavior modification progress over weeks and months.', type: 'WORKSHEET', fileSizeBytes: 943718, tags: ['tracking', 'progress', 'behavior'], downloadCount: 1670, status: 'PUBLISHED' },
  { id: 'res-service-dog-checklist', title: 'Service Dog Task Checklist', description: 'Evaluation checklist for service dog task training milestones.', type: 'CHECKLIST', fileSizeBytes: 734003, tags: ['service dog', 'tasks', 'evaluation'], downloadCount: 540, status: 'PUBLISHED' },
  { id: 'res-calm-conditioning', title: 'Calm Conditioning Audio Guide', description: 'Guided relaxation protocol for building calmness in anxious dogs.', type: 'AUDIO', durationSeconds: 1320, tags: ['calm', 'relaxation', 'behavior'], downloadCount: 678, status: 'PUBLISHED' },
];

// Certification
const CERTIFICATIONS = [
  {
    id: 'cert-professional-trainer',
    title: 'K9 Professional Trainer Certification',
    slug: 'k9-professional-trainer',
    description: 'The flagship K9 Genius certification validating professional-level dog training knowledge and skills.',
    overview: 'Complete 5 core courses and 2 electives, pass a practical assessment, and score 80% or higher on the final exam.',
    validityMonths: 24,
    status: 'PUBLISHED',
    requiredCourses: ['course-behavior-basics', 'course-advanced-obedience', 'course-reactivity-management', 'course-service-dog-foundation', 'course-puppy-development'],
    electiveCourses: ['course-agility-fundamentals', 'course-therapy-dog-prep', 'course-puppy-socialization', 'course-competitive-agility'],
  },
  {
    id: 'cert-behavior-specialist',
    title: 'K9 Behavior Specialist',
    slug: 'k9-behavior-specialist',
    description: 'Advanced certification for trainers specializing in behavior modification and problem behaviors.',
    overview: 'Complete 4 behavior-focused courses and demonstrate case study proficiency.',
    validityMonths: 24,
    status: 'PUBLISHED',
    requiredCourses: ['course-behavior-basics', 'course-reactivity-management'],
    electiveCourses: ['course-puppy-development', 'course-service-dog-foundation'],
  },
  {
    id: 'cert-canine-first-aid',
    title: 'Canine First Aid & Safety',
    slug: 'canine-first-aid',
    description: 'Essential first aid skills for anyone working with dogs.',
    overview: 'Complete the first aid course and pass the certification exam.',
    validityMonths: 12,
    status: 'PUBLISHED',
    requiredCourses: [],
    electiveCourses: [],
  },
];

// Roadmap
const ROADMAPS = [
  {
    id: 'roadmap-professional-cert',
    title: 'K9 Professional Certification Pathway',
    slug: 'professional-certification-pathway',
    description: 'Your guided pathway to becoming a K9 Certified Professional Trainer.',
  },
  {
    id: 'roadmap-agility-specialist',
    title: 'Agility Specialist Track',
    slug: 'agility-specialist-track',
    description: 'Master agility training from fundamentals to competition level.',
  },
];

// ============================================================
// SEED PAGE COMPONENT
// ============================================================

export default function SeedPage() {
  const { user, role } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const log = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const seed = useCallback(async () => {
    if (!user) {
      log('ERROR: Not authenticated. Please sign in first.');
      return;
    }

    setRunning(true);
    setDone(false);

    try {
      // Check if already seeded
      const coursesSnap = await getDocs(query(collection(clientDb, 'courses'), limit(1)));
      if (!coursesSnap.empty) {
        log('WARNING: Database already has courses. Skipping seed to avoid duplicates.');
        log('If you want to re-seed, delete the courses collection first.');
        setRunning(false);
        return;
      }

      // ---- COURSES ----
      log('Creating courses...');
      for (const course of COURSES) {
        const { id, ...data } = course;
        await setDoc(doc(clientDb, 'courses', id), { ...data, trainerId: user.uid });
        log(`  + Course: ${data.title}`);
      }
      log(`Created ${COURSES.length} courses.`);

      // ---- MODULES & LESSONS ----
      log('Creating modules and lessons...');
      let moduleCount = 0;
      let lessonCount = 0;
      for (const [courseId, content] of Object.entries(COURSE_CONTENT)) {
        for (const mod of content.modules) {
          const { id: modId, lessons, ...modData } = mod;
          await setDoc(doc(clientDb, 'modules', modId), { ...modData, courseId, createdAt: now, updatedAt: now });
          moduleCount++;

          for (const lesson of lessons) {
            const { id: lesId, ...lesData } = lesson;
            await setDoc(doc(clientDb, 'lessons', lesId), { ...lesData, moduleId: modId, createdAt: now, updatedAt: now });
            lessonCount++;
          }
        }
        log(`  + ${courseId}: modules & lessons created`);
      }
      log(`Created ${moduleCount} modules and ${lessonCount} lessons.`);

      // ---- RESOURCES ----
      log('Creating resources...');
      for (const resource of RESOURCES) {
        const { id, ...data } = resource;
        await setDoc(doc(clientDb, 'lmsResources', id), { ...data, scope: 'GLOBAL', createdAt: now, updatedAt: now });
      }
      log(`Created ${RESOURCES.length} resources.`);

      // ---- CERTIFICATIONS ----
      log('Creating certifications...');
      for (const cert of CERTIFICATIONS) {
        const { id, requiredCourses, electiveCourses, ...certData } = cert;
        await setDoc(doc(clientDb, 'lmsCertifications', id), { ...certData, createdAt: now, updatedAt: now });

        let sortOrder = 1;
        for (const courseId of requiredCourses) {
          await setDoc(doc(clientDb, 'lmsCertCourses', `${id}-${courseId}`), {
            certificationId: id,
            courseId,
            isRequired: true,
            sortOrder: sortOrder++,
            createdAt: now,
          });
        }
        for (const courseId of electiveCourses) {
          await setDoc(doc(clientDb, 'lmsCertCourses', `${id}-${courseId}`), {
            certificationId: id,
            courseId,
            isRequired: false,
            sortOrder: sortOrder++,
            createdAt: now,
          });
        }
        log(`  + Certification: ${certData.title} (${requiredCourses.length} required, ${electiveCourses.length} elective courses)`);
      }

      // ---- ROADMAPS ----
      log('Creating roadmaps...');
      for (const roadmap of ROADMAPS) {
        const { id, ...data } = roadmap;
        await setDoc(doc(clientDb, 'lmsRoadmaps', id), { ...data, status: 'PUBLISHED', createdAt: now, updatedAt: now });
        log(`  + Roadmap: ${data.title}`);
      }

      // Create roadmap steps for the professional cert pathway
      const profSteps = [
        { id: 'step-1', title: 'Canine Behavior Basics', stepType: 'COURSE', linkedEntityId: 'course-behavior-basics', sortOrder: 1 },
        { id: 'step-2', title: 'Learning Theory & Training Methods', stepType: 'COURSE', linkedEntityId: 'course-puppy-development', sortOrder: 2 },
        { id: 'step-3', title: 'Advanced Obedience Techniques', stepType: 'COURSE', linkedEntityId: 'course-advanced-obedience', sortOrder: 3 },
        { id: 'step-4', title: 'Reactivity & Behavior Modification', stepType: 'COURSE', linkedEntityId: 'course-reactivity-management', sortOrder: 4 },
        { id: 'step-5', title: 'Service Dog Foundation', stepType: 'COURSE', linkedEntityId: 'course-service-dog-foundation', sortOrder: 5 },
        { id: 'step-6', title: 'Choose 2 Elective Courses', stepType: 'MILESTONE', sortOrder: 6 },
        { id: 'step-7', title: 'Practical Skills Assessment', stepType: 'QUIZ', sortOrder: 7 },
        { id: 'step-8', title: 'Final Certification Exam', stepType: 'CERTIFICATION', linkedEntityId: 'cert-professional-trainer', sortOrder: 8 },
      ];
      for (const step of profSteps) {
        const { id: stepId, ...stepData } = step;
        await setDoc(doc(clientDb, 'lmsRoadmapSteps', `roadmap-professional-cert-${stepId}`), {
          ...stepData,
          roadmapId: 'roadmap-professional-cert',
          prerequisiteStepIds: [],
          createdAt: now,
        });
      }
      log(`  + Created ${profSteps.length} steps for Professional Certification Pathway`);

      // ---- ENROLL CURRENT USER in first 2 courses ----
      log('Enrolling you in starter courses...');
      const enrollments = [
        { courseId: 'course-behavior-basics', progress: 65 },
        { courseId: 'course-advanced-obedience', progress: 35 },
      ];
      for (const enrollment of enrollments) {
        const enrollId = `${user.uid}-${enrollment.courseId}`;
        await setDoc(doc(clientDb, 'lmsEnrollments', enrollId), {
          userId: user.uid,
          courseId: enrollment.courseId,
          enrolledAt: now,
          lastAccessedAt: now,
          progress: enrollment.progress,
          completedAt: null,
        });
        log(`  + Enrolled in: ${enrollment.courseId} (${enrollment.progress}% progress)`);
      }

      // ---- CREATE CERT CANDIDACY ----
      log('Creating certification candidacy...');
      await setDoc(doc(clientDb, 'lmsCertCandidacies', `${user.uid}-cert-professional-trainer`), {
        userId: user.uid,
        certificationId: 'cert-professional-trainer',
        status: 'IN_PROGRESS',
        enrolledAt: now,
        completedAt: null,
        certificateUrl: null,
      });
      log('  + Candidacy for K9 Professional Trainer Certification');

      // ---- ASSIGN ROADMAP ----
      log('Assigning roadmap...');
      await setDoc(doc(clientDb, 'lmsUserRoadmapProgress', `${user.uid}-roadmap-professional-cert`), {
        userId: user.uid,
        roadmapId: 'roadmap-professional-cert',
        overallProgress: 25,
        completedSteps: 2,
        totalSteps: 8,
        startedAt: now,
        updatedAt: now,
      });
      log('  + Assigned to Professional Certification Pathway');

      // ---- UPDATE USER DOC ----
      log('Updating your user document...');
      await setDoc(doc(clientDb, 'users', user.uid), {
        email: user.email || 'salesfunnelmatty@gmail.com',
        displayName: user.displayName || 'Matty Couperthwaite',
        firstName: 'Matty',
        lastName: 'Couperthwaite',
        role: 'ADMIN',
        totalXP: 2450,
        totalGems: 180,
        bio: 'Professional dog trainer and founder of K9 Genius Collective.',
        location: 'Portland, OR',
        trainerSpecializations: ['Behavior', 'Obedience', 'Puppy Training'],
        createdAt: now,
        updatedAt: now,
      }, { merge: true });
      log('  + User profile updated');

      log('');
      log('=== SEED COMPLETE ===');
      log(`Summary: ${COURSES.length} courses, ${moduleCount} modules, ${lessonCount} lessons, ${RESOURCES.length} resources, ${CERTIFICATIONS.length} certifications, ${ROADMAPS.length} roadmaps`);
      log('');
      log('You can now visit the LMS at http://localhost:3003 to see your data!');
      setDone(true);
    } catch (err: any) {
      log(`ERROR: ${err.message}`);
      log('This may be a Firestore security rules issue. Make sure your role is set to ADMIN.');
      console.error(err);
    } finally {
      setRunning(false);
    }
  }, [user, log]);

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Database Seed Tool</h1>
        <p className="text-slate-400 mb-8">
          Populate your Firestore database with starter K9 Genius course content.
        </p>

        {/* Auth Status */}
        <div className="bg-[#1a1f29] border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Signed in as:</p>
              <p className="font-medium">{user?.email || 'Not signed in'}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              role === 'ADMIN' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
            }`}>
              {role || 'NO ROLE'}
            </span>
          </div>
        </div>

        {/* What will be created */}
        <div className="bg-[#1a1f29] border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">This will create:</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-teal-900 text-teal-200 rounded-lg flex items-center justify-center font-bold">{COURSES.length}</span>
              <span className="text-slate-300">Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-900 text-blue-200 rounded-lg flex items-center justify-center font-bold">{Object.values(COURSE_CONTENT).reduce((a, c) => a + c.modules.length, 0)}</span>
              <span className="text-slate-300">Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-900 text-purple-200 rounded-lg flex items-center justify-center font-bold">{Object.values(COURSE_CONTENT).reduce((a, c) => a + c.modules.reduce((b: number, m) => b + m.lessons.length, 0), 0)}</span>
              <span className="text-slate-300">Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-900 text-orange-200 rounded-lg flex items-center justify-center font-bold">{RESOURCES.length}</span>
              <span className="text-slate-300">Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-900 text-yellow-200 rounded-lg flex items-center justify-center font-bold">{CERTIFICATIONS.length}</span>
              <span className="text-slate-300">Certifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-red-900 text-red-200 rounded-lg flex items-center justify-center font-bold">{ROADMAPS.length}</span>
              <span className="text-slate-300">Roadmaps</span>
            </div>
          </div>
        </div>

        {/* Seed Button */}
        <button
          onClick={seed}
          disabled={running || !user}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-all mb-6 ${
            done
              ? 'bg-green-700 text-white cursor-default'
              : running
              ? 'bg-slate-700 text-slate-400 cursor-wait'
              : 'bg-[#F39C12] text-black hover:bg-yellow-400'
          }`}
        >
          {done ? 'Seed Complete!' : running ? 'Seeding Database...' : 'Seed Database'}
        </button>

        {/* Log Output */}
        {logs.length > 0 && (
          <div className="bg-[#0a0d11] border border-slate-800 rounded-xl p-4 font-mono text-xs max-h-96 overflow-y-auto">
            {logs.map((line, i) => (
              <div
                key={i}
                className={`py-0.5 ${
                  line.includes('ERROR') ? 'text-red-400' :
                  line.includes('WARNING') ? 'text-yellow-400' :
                  line.includes('===') ? 'text-green-400 font-bold' :
                  line.startsWith('  +') ? 'text-teal-400' :
                  'text-slate-300'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}