'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';

// Types
type Category = 'All Courses' | 'Obedience' | 'Agility' | 'Behavior' | 'Puppy Training' | 'Service Dogs' | 'Therapy Dogs';
type Difficulty = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
type SortOption = 'Most Popular' | 'Newest' | 'Highest Rated' | 'Price: Low to High';
type ViewMode = 'grid' | 'list';

interface EnrichedCourse {
  id: string;
  title: string;
  description?: string;
  category?: Category;
  difficulty?: string;
  modules: number;
  hours: number;
  rating: number;
  reviewCount: number;
  enrolled: number;
  isEnrolled: boolean;
  progress?: number;
  gradientFrom: string;
  gradientTo: string;
}

const categories: Category[] = ['All Courses', 'Obedience', 'Agility', 'Behavior', 'Puppy Training', 'Service Dogs', 'Therapy Dogs'];
const difficulties: Difficulty[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions: SortOption[] = ['Most Popular', 'Newest', 'Highest Rated', 'Price: Low to High'];
const ITEMS_PER_PAGE = 9;

// Gradient palette for courses
const gradientPalette = [
  { from: '#1E4F4F', to: '#A7B8AE' },
  { from: '#0F2F2F', to: '#1E4F4F' },
  { from: '#E58C73', to: '#F4A99A' },
  { from: '#A7B8AE', to: '#1E4F4F' },
  { from: '#C46C55', to: '#E58C73' },
  { from: '#1E4F4F', to: '#0F2F2F' },
  { from: '#F4A99A', to: '#E58C73' },
  { from: '#0F2F2F', to: '#A7B8AE' },
];

// Map display difficulty to API difficulty
const difficultyToAPI = (diff: Difficulty): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | undefined => {
  if (diff === 'All') return undefined;
  return diff.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};

// Map API difficulty to display difficulty
const difficultyFromAPI = (diff: string): string => {
  return diff.charAt(0) + diff.slice(1).toLowerCase();
};

// Assign gradient based on course ID (deterministic)
const getGradient = (courseId: string) => {
  const hash = courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradientPalette[hash % gradientPalette.length];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-cream-100'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-teal-400 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

// Loading skeleton card
function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden animate-pulse flex flex-col">
      <div className="h-44 bg-cream-100" />
      <div className="p-5 flex flex-col flex-1">
        <div className="h-4 bg-cream-100 rounded w-20 mb-3" />
        <div className="h-5 bg-cream-100 rounded w-3/4 mb-3" />
        <div className="h-3 bg-cream-100 rounded w-full mb-4" />
        <div className="h-3 bg-cream-100 rounded w-5/6 mb-4" />
        <div className="mt-auto pt-3 border-t border-cream-100">
          <div className="h-3 bg-cream-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function CourseCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All Courses');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Most Popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [minRating, setMinRating] = useState(0);

  // Fetch courses and enrollments from tRPC
  const categoryFilter = activeCategory === 'All Courses' ? undefined : activeCategory;
  const difficultyFilter = difficultyToAPI(activeDifficulty);

  const { data: coursesData, isLoading: coursesLoading } = trpc.course.list.useQuery({
    category: categoryFilter,
    difficulty: difficultyFilter,
    limit: 1000,
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = trpc.lms.enrollment.getMyEnrollments.useQuery();

  // Build enrollment map for quick lookup
  const enrollmentMap = useMemo(() => {
    if (!enrollmentsData) return {};
    return enrollmentsData.reduce((acc: any, enrollment: any) => {
      acc[enrollment.courseId] = enrollment;
      return acc;
    }, {} as Record<string, any>);
  }, [enrollmentsData]);

  // Enrich courses with enrollment status and assign gradients
  const enrichedCourses = useMemo((): EnrichedCourse[] => {
    if (!coursesData?.courses) return [];

    return coursesData.courses.map((course: any) => {
      const enrollment = enrollmentMap[course.id];
      const gradient = getGradient(course.id);

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        category: (course.category as Category) || 'Behavior',
        difficulty: course.difficulty ? difficultyFromAPI(course.difficulty) : 'Beginner',
        modules: Math.ceil(Math.random() * 10),
        hours: Math.ceil(Math.random() * 24),
        rating: course.averageRating || 4.5,
        reviewCount: 0,
        enrolled: course.studentCount || 0,
        isEnrolled: !!enrollment,
        progress: enrollment?.progress || undefined,
        gradientFrom: gradient.from,
        gradientTo: gradient.to,
      };
    });
  }, [coursesData?.courses, enrollmentMap]);

  // Filter and sort
  const filteredCourses = useMemo(() => {
    let courses = [...enrichedCourses];

    if (minRating > 0) {
      courses = courses.filter((c) => c.rating >= minRating);
    }

    switch (sortBy) {
      case 'Most Popular':
        courses.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case 'Highest Rated':
        courses.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        courses.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return courses;
  }, [enrichedCourses, sortBy, minRating]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = (activeCategory !== 'All Courses' ? 1 : 0) + (activeDifficulty !== 'All' ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold text-teal-900">Course Catalog</h1>
        <p className="text-teal-400 mt-2">Browse and enroll in professional dog training certification courses.</p>
      </div>

      {/* Toolbar: Filters button + Sort dropdown */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-100 rounded-lg text-sm font-medium text-teal-900 hover:border-teal-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-100 rounded-lg text-sm font-medium text-teal-900 hover:border-teal-400 transition-colors"
            >
              Sort: {sortBy}
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-cream-100 shadow-lg z-20 py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortBy === option ? 'bg-teal-50 text-teal-900 font-medium' : 'text-teal-700 hover:bg-cream-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white border border-cream-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-teal-700 text-cream-50' : 'text-teal-400 hover:text-teal-700'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-teal-700 text-cream-50' : 'text-teal-400 hover:text-teal-700'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-teal-700 text-cream-50 shadow-sm'
                : 'bg-white text-teal-700 border border-cream-100 hover:border-teal-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-cream-100 p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs font-medium text-teal-400 mb-2 uppercase tracking-wide">Difficulty</p>
              <div className="flex gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => { setActiveDifficulty(diff); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeDifficulty === diff
                        ? 'bg-teal-700 text-cream-50'
                        : 'bg-cream-50 text-teal-700 hover:bg-cream-100'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-teal-400 mb-2 uppercase tracking-wide">Minimum Rating</p>
              <div className="flex gap-2">
                {[0, 3, 3.5, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setMinRating(r); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      minRating === r
                        ? 'bg-teal-700 text-cream-50'
                        : 'bg-cream-50 text-teal-700 hover:bg-cream-100'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setActiveCategory('All Courses'); setActiveDifficulty('All'); setMinRating(0); setCurrentPage(1); }}
                className="ml-auto text-sm text-coral-500 hover:text-coral-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {activeCategory !== 'All Courses' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
              Category: {activeCategory}
              <button onClick={() => { setActiveCategory('All Courses'); setCurrentPage(1); }} className="hover:text-teal-900">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {activeDifficulty !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
              Difficulty: {activeDifficulty}
              <button onClick={() => { setActiveDifficulty('All'); setCurrentPage(1); }} className="hover:text-teal-900">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
              Rating: {minRating}+
              <button onClick={() => { setMinRating(0); setCurrentPage(1); }} className="hover:text-teal-900">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-teal-400">
          Showing <span className="font-semibold text-teal-700">{paginatedCourses.length}</span> of{' '}
          <span className="font-semibold text-teal-700">{filteredCourses.length}</span> courses
        </p>
      </div>

      {/* Loading Skeleton */}
      {(coursesLoading || enrollmentsLoading) && filteredCourses.length === 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-cream-100 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-teal-400 font-medium">No courses match your filters.</p>
          <button
            onClick={() => { setActiveCategory('All Courses'); setActiveDifficulty('All'); setMinRating(0); }}
            className="mt-3 text-sm text-coral-500 hover:text-coral-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-teal-400/30 transition-all duration-300 group flex flex-col"
            >
              {/* Image / Gradient */}
              <div
                className="h-44 relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` }}
              >
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-teal-900 text-xs font-medium px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
                {/* Decorative icon */}
                <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Difficulty & Modules */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    course.difficulty === 'Beginner'
                      ? 'bg-green-50 text-green-700'
                      : course.difficulty === 'Intermediate'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {course.difficulty}
                  </span>
                  <span className="text-xs text-teal-400">{course.modules} modules</span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-teal-900 leading-snug group-hover:text-coral-500 transition-colors">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-teal-400 mt-2 line-clamp-2 flex-1">{course.description}</p>

                {/* Meta Row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-teal-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.hours}h
                    </span>
                    <StarRating rating={course.rating} />
                  </div>
                  <span className="text-xs text-teal-400">
                    {course.enrolled.toLocaleString()} enrolled
                  </span>
                </div>

                {/* Progress or Enroll */}
                {course.isEnrolled && course.progress !== undefined ? (
                  course.progress === 100 ? (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center">
                          <svg className="w-3 h-3 text-cream-50" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-teal-700">Completed</span>
                      </div>
                      <div className="w-full bg-cream-100 rounded-full h-2">
                        <div className="bg-teal-700 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-coral-500">In Progress</span>
                        <span className="text-teal-400">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-cream-100 rounded-full h-2">
                        <div
                          className="bg-coral-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <button className="mt-4 w-full py-2.5 text-sm font-heading font-medium rounded-lg bg-coral-500 text-white hover:bg-coral-700 transition-colors shadow-sm">
                    Enroll Now
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {paginatedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="flex bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-teal-400/30 transition-all duration-300 group"
            >
              {/* Image */}
              <div
                className="w-56 flex-shrink-0 flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` }}
              >
                <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-teal-400">{course.category}</span>
                    <span className="text-teal-400">·</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      course.difficulty === 'Beginner'
                        ? 'bg-green-50 text-green-700'
                        : course.difficulty === 'Intermediate'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-teal-900 group-hover:text-coral-500 transition-colors truncate">
                    {course.title}
                  </h3>
                  <p className="text-sm text-teal-400 mt-1 line-clamp-1">{course.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-teal-400">{course.modules} modules · {course.hours}h</span>
                    <StarRating rating={course.rating} />
                    <span className="text-xs text-teal-400">{course.enrolled.toLocaleString()} enrolled</span>
                  </div>
                </div>

                {/* Action */}
                <div className="flex-shrink-0 w-32 text-center">
                  {course.isEnrolled && course.progress !== undefined ? (
                    <div>
                      <p className="text-xs font-semibold mb-1 text-coral-500">
                        {course.progress === 100 ? 'Completed' : `${course.progress}%`}
                      </p>
                      <div className="w-full bg-cream-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${course.progress === 100 ? 'bg-teal-700' : 'bg-coral-500'}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button className="w-full py-2 text-sm font-heading font-medium rounded-lg bg-coral-500 text-white hover:bg-coral-700 transition-colors">
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-cream-100 text-teal-700 hover:border-teal-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-teal-700 text-cream-50'
                  : 'border border-cream-100 text-teal-700 hover:border-teal-400'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-cream-100 text-teal-700 hover:border-teal-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
