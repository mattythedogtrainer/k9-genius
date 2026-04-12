'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Worksheet' | 'Template' | 'Audio' | 'Checklist';
  size: string;
  course: string;
  downloads: number;
  icon: React.ReactNode;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Canine Body Language Chart',
    description: 'Visual guide to interpreting canine body signals and behavior cues.',
    type: 'PDF',
    size: '2.4 MB',
    course: 'Behavior Basics',
    downloads: 1240,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: '2',
    title: 'Reactivity Assessment Worksheet',
    description: 'Comprehensive worksheet for evaluating and tracking canine reactivity levels.',
    type: 'Worksheet',
    size: '1.1 MB',
    course: 'Reactivity Management',
    downloads: 856,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: '3',
    title: 'Training Session Template',
    description: 'Ready-to-use template for planning and documenting training sessions.',
    type: 'Template',
    size: '0.8 MB',
    course: 'General',
    downloads: 2100,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: '4',
    title: 'Puppy Socialization Checklist',
    description: 'Essential checklist for puppy socialization milestones and safety protocols.',
    type: 'Checklist',
    size: '0.5 MB',
    course: 'Puppy Development',
    downloads: 1890,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: '5',
    title: 'Clicker Training Fundamentals',
    description: 'Video walkthrough of clicker training principles and practical applications.',
    type: 'Video',
    size: '45 min',
    course: 'Basic Obedience',
    downloads: 3200,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: '6',
    title: 'Calm Conditioning Audio Guide',
    description: 'Audio meditation and conditioning guide for teaching relaxation techniques.',
    type: 'Audio',
    size: '22 min',
    course: 'Behavior Modification',
    downloads: 678,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-6-6m6 6l-6-6m6 6l6 6m-6-6l6-6" />
      </svg>
    ),
  },
  {
    id: '7',
    title: 'Client Intake Form Template',
    description: 'Professional client intake form for documenting dog history and goals.',
    type: 'Template',
    size: '0.6 MB',
    course: 'Professional Skills',
    downloads: 1450,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: '8',
    title: 'Leash Handling Techniques Guide',
    description: 'Detailed guide to advanced leash handling and loose-leash walking techniques.',
    type: 'PDF',
    size: '3.8 MB',
    course: 'Obedience',
    downloads: 920,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: '9',
    title: 'Fear Periods Development Chart',
    description: 'Timeline chart of puppy developmental fear periods and management strategies.',
    type: 'PDF',
    size: '1.2 MB',
    course: 'Puppy Development',
    downloads: 1100,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: '10',
    title: 'Training Progress Tracker',
    description: 'Worksheet for tracking student and dog progress through training levels.',
    type: 'Worksheet',
    size: '0.9 MB',
    course: 'General',
    downloads: 1670,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: '11',
    title: 'Service Dog Task Checklist',
    description: 'Comprehensive checklist for service dog task training and certification.',
    type: 'Checklist',
    size: '0.7 MB',
    course: 'Service Dogs',
    downloads: 540,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: '12',
    title: 'Advanced Recall Training Video',
    description: 'Video demonstrating advanced recall training techniques and troubleshooting.',
    type: 'Video',
    size: '38 min',
    course: 'Advanced Obedience',
    downloads: 2800,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const categories = ['All', 'PDFs', 'Videos', 'Worksheets', 'Templates', 'Audio Guides', 'Checklists'];

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  PDF: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
  Video: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
  Worksheet: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500' },
  Template: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
  Audio: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
  Checklist: { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-500' },
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.course.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' ||
      (selectedCategory === 'PDFs' && resource.type === 'PDF') ||
      (selectedCategory === 'Videos' && resource.type === 'Video') ||
      (selectedCategory === 'Worksheets' && resource.type === 'Worksheet') ||
      (selectedCategory === 'Templates' && resource.type === 'Template') ||
      (selectedCategory === 'Audio Guides' && resource.type === 'Audio') ||
      (selectedCategory === 'Checklists' && resource.type === 'Checklist');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-bold text-teal-900">Resources</h1>
          <p className="text-lg text-teal-700">Training materials, guides, and downloadable tools to support your learning.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources, courses, or materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 bg-white border border-cream-100 rounded-lg text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent font-body"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0010.5 10.5z" />
          </svg>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-teal-700 text-cream-50 shadow-md'
                  : 'bg-white text-teal-700 border border-cream-100 hover:bg-cream-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const colors = typeColors[resource.type];
            return (
              <div
                key={resource.id}
                className="bg-white rounded-lg border border-cream-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col"
              >
                {/* Type Icon Background */}
                <div className={`${colors.bg} p-6 flex items-center justify-center relative`}>
                  <div className={`${colors.icon} transition-transform group-hover:scale-110`}>
                    {resource.icon}
                  </div>
                  {/* File Type Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${colors.text} ${colors.bg} border ${colors.text.replace('text-', 'border-')}`}>
                    {resource.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-teal-900 text-sm mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-teal-700 mb-4 line-clamp-2 flex-1">
                    {resource.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-3 mb-4 text-xs">
                    <div className="flex items-center justify-between text-teal-600">
                      <span>{resource.size}</span>
                      <span className="font-medium text-teal-900">{resource.downloads.toLocaleString()} {resource.type === 'Video' || resource.type === 'Audio' ? 'views' : 'downloads'}</span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-cream-100 text-teal-700 rounded-full text-xs font-medium">
                      {resource.course}
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="w-full bg-teal-700 text-cream-50 py-2 rounded-lg font-medium text-sm hover:bg-teal-900 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-teal-700 text-lg font-body">No resources found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-teal-700 text-cream-50 rounded-lg text-sm font-medium hover:bg-teal-900 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Featured Collections */}
        <div className="space-y-4 mt-12 pt-8 border-t border-cream-100">
          <h2 className="text-2xl font-heading font-bold text-teal-900">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starter Kit */}
            <div className="relative overflow-hidden rounded-lg p-8 text-cream-50 min-h-[240px] flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgb(30, 79, 79) 0%, rgb(15, 47, 47) 100%)'
              }}
            >
              <div>
                <h3 className="text-2xl font-heading font-bold mb-2">Starter Kit</h3>
                <p className="text-cream-100 text-sm mb-4">8 essential resources for new students</p>
              </div>
              <div className="flex items-center gap-2 text-cream-100 group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">Explore Collection</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Certification Prep Pack */}
            <div className="relative overflow-hidden rounded-lg p-8 text-teal-900 min-h-[240px] flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgb(245, 154, 154) 0%, rgb(229, 140, 115) 100%)'
              }}
            >
              <div>
                <h3 className="text-2xl font-heading font-bold mb-2">Certification Prep Pack</h3>
                <p className="text-teal-800 text-sm mb-4">12 resources for exam preparation</p>
              </div>
              <div className="flex items-center gap-2 text-teal-800 group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">Explore Collection</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
