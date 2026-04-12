'use client';

import { useState } from 'react';

interface Discussion {
  id: number;
  title: string;
  author: string;
  role: 'Certified Trainer' | 'Student' | 'Expert' | 'Admin';
  initials: string;
  avatarColor: string;
  category: string;
  preview: string;
  replies: number;
  views: number;
  timePosted: string;
  pinned: boolean;
}

interface Member {
  id: number;
  name: string;
  role: 'Certified Trainer' | 'Student' | 'Expert';
  location: string;
  initials: string;
  avatarColor: string;
  specializations: string[];
  joinDate: string;
}

interface CommunityEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  timezone: string;
  description: string;
  trainer?: string;
  attendees: number;
  registered: boolean;
}

const discussionData: Discussion[] = [
  {
    id: 1,
    title: 'Best Techniques for Recall Training in Open Fields',
    author: 'Sarah M.',
    role: 'Certified Trainer',
    initials: 'SM',
    avatarColor: 'bg-teal-700',
    category: 'Training Tips',
    preview: "I've been working with off-leash recall in larger spaces and wanted to share some techniques...",
    replies: 24,
    views: 342,
    timePosted: '2 days ago',
    pinned: true,
  },
  {
    id: 2,
    title: 'Monthly Challenge: Share Your Training Wins!',
    author: 'K9 Genius Team',
    role: 'Admin',
    initials: 'KG',
    avatarColor: 'bg-coral-500',
    category: 'Success Stories',
    preview: 'April edition is live! Share your training breakthroughs and celebrate community wins...',
    replies: 67,
    views: 1200,
    timePosted: '5 days ago',
    pinned: true,
  },
  {
    id: 3,
    title: 'Dealing with Leash Reactivity — My Journey',
    author: 'Mike R.',
    role: 'Student',
    initials: 'MR',
    avatarColor: 'bg-teal-400',
    category: 'Behavior Issues',
    preview: "Started with a very reactive dog six months ago. Here's what finally worked for us...",
    replies: 18,
    views: 156,
    timePosted: '1 week ago',
    pinned: false,
  },
  {
    id: 4,
    title: 'Equipment Review: Best Treat Pouches for 2025',
    author: 'Lisa K.',
    role: 'Certified Trainer',
    initials: 'LK',
    avatarColor: 'bg-teal-700',
    category: 'Equipment Reviews',
    preview: 'I tested 12 different treat pouches this year. Here are my top picks for durability...',
    replies: 31,
    views: 289,
    timePosted: '1 week ago',
    pinned: false,
  },
  {
    id: 5,
    title: 'Puppy Socialization Window — When is Too Late?',
    author: 'David T.',
    role: 'Student',
    initials: 'DT',
    avatarColor: 'bg-teal-400',
    category: 'Ask an Expert',
    preview: "I've heard conflicting information about the socialization window. Can someone clarify...",
    replies: 12,
    views: 98,
    timePosted: '2 weeks ago',
    pinned: false,
  },
  {
    id: 6,
    title: 'Success Story: From Fearful Rescue to Therapy Dog',
    author: 'Anna P.',
    role: 'Certified Trainer',
    initials: 'AP',
    avatarColor: 'bg-teal-700',
    category: 'Success Stories',
    preview: 'A remarkable transformation over 8 months. This rescue dog is now certified and helping...',
    replies: 45,
    views: 567,
    timePosted: '2 weeks ago',
    pinned: false,
  },
  {
    id: 7,
    title: 'Advanced Agility Course Design Tips',
    author: 'Coach James',
    role: 'Expert',
    initials: 'CJ',
    avatarColor: 'bg-coral-500',
    category: 'Training Tips',
    preview: 'Pro tips for designing progressions that challenge dogs safely while building confidence...',
    replies: 9,
    views: 72,
    timePosted: '3 weeks ago',
    pinned: false,
  },
  {
    id: 8,
    title: 'Understanding Canine Body Language Seminar Notes',
    author: 'Rachel W.',
    role: 'Student',
    initials: 'RW',
    avatarColor: 'bg-teal-400',
    category: 'Training Tips',
    preview: 'Sharing notes from the live seminar on reading subtle body signals in group settings...',
    replies: 15,
    views: 134,
    timePosted: '3 weeks ago',
    pinned: false,
  },
];

const memberData: Member[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Certified Trainer',
    location: 'Portland, OR',
    initials: 'SM',
    avatarColor: 'bg-teal-700',
    specializations: ['Obedience', 'Behavior'],
    joinDate: 'Jan 2024',
  },
  {
    id: 2,
    name: 'James Cooper',
    role: 'Expert',
    location: 'Austin, TX',
    initials: 'JC',
    avatarColor: 'bg-coral-500',
    specializations: ['Agility', 'Competition'],
    joinDate: 'Mar 2023',
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    role: 'Student',
    location: 'Denver, CO',
    initials: 'MR',
    avatarColor: 'bg-teal-400',
    specializations: ['Puppy Training'],
    joinDate: 'Sep 2025',
  },
  {
    id: 4,
    name: 'Lisa Kim',
    role: 'Certified Trainer',
    location: 'Seattle, WA',
    initials: 'LK',
    avatarColor: 'bg-teal-700',
    specializations: ['Service Dogs'],
    joinDate: 'Jun 2024',
  },
  {
    id: 5,
    name: 'Anna Petrov',
    role: 'Certified Trainer',
    location: 'Chicago, IL',
    initials: 'AP',
    avatarColor: 'bg-teal-700',
    specializations: ['Therapy Dogs', 'Behavior'],
    joinDate: 'Nov 2023',
  },
  {
    id: 6,
    name: 'David Torres',
    role: 'Student',
    location: 'Miami, FL',
    initials: 'DT',
    avatarColor: 'bg-teal-400',
    specializations: ['Obedience'],
    joinDate: 'Jan 2026',
  },
  {
    id: 7,
    name: 'Rachel Wong',
    role: 'Student',
    location: 'San Francisco, CA',
    initials: 'RW',
    avatarColor: 'bg-teal-400',
    specializations: ['Behavior', 'Reactivity'],
    joinDate: 'Aug 2025',
  },
  {
    id: 8,
    name: 'Coach James',
    role: 'Expert',
    location: 'Nashville, TN',
    initials: 'CJ',
    avatarColor: 'bg-coral-500',
    specializations: ['Agility', 'Tracking'],
    joinDate: 'Feb 2022',
  },
];

const eventData: CommunityEvent[] = [
  {
    id: 1,
    title: 'Live Q&A: Reactivity Solutions',
    date: 'Apr 18, 2026',
    time: '7:00 PM',
    timezone: 'EST',
    description: 'Join Sarah M. for an interactive session addressing common leash reactivity challenges.',
    trainer: 'Sarah M.',
    attendees: 142,
    registered: false,
  },
  {
    id: 2,
    title: 'Monthly Training Challenge Kickoff',
    date: 'May 1, 2026',
    time: '12:00 PM',
    timezone: 'EST',
    description: 'Launch your May training wins! Share progress throughout the month for community recognition.',
    attendees: 287,
    registered: true,
  },
  {
    id: 3,
    title: 'Webinar: Canine Nutrition & Performance',
    date: 'May 8, 2026',
    time: '6:00 PM',
    timezone: 'EST',
    description: 'Expert insights on nutrition strategies for optimal canine performance and health.',
    attendees: 198,
    registered: false,
  },
  {
    id: 4,
    title: 'In-Person Meetup: Portland Dog Park',
    date: 'May 15, 2026',
    time: '10:00 AM',
    timezone: 'PST',
    description: 'Meet community members in person! Bring your pup for off-leash playtime and networking.',
    attendees: 34,
    registered: false,
  },
];

const categories = ['All Topics', 'Training Tips', 'Behavior Issues', 'Success Stories', 'Equipment Reviews', 'Ask an Expert'];

const memberFilters = ['All', 'Certified Trainers', 'Students', 'Experts'];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Certified Trainer':
      return 'bg-teal-100 text-teal-900';
    case 'Expert':
      return 'bg-coral-300 text-coral-700';
    case 'Admin':
      return 'bg-coral-500 text-white';
    case 'Student':
      return 'bg-cream-100 text-teal-900';
    default:
      return 'bg-cream-100 text-teal-900';
  }
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'discussions' | 'members' | 'events'>('discussions');
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('All');
  const [eventRegistrations, setEventRegistrations] = useState<{[key: number]: boolean}>({
    2: true,
  });

  const filteredDiscussions = selectedCategory === 'All Topics'
    ? discussionData
    : discussionData.filter((d) => d.category === selectedCategory);

  const filteredMembers = memberData.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(memberSearchQuery.toLowerCase());
    const matchesFilter = memberFilter === 'All' || member.role === memberFilter.replace('s', '');
    return matchesSearch && matchesFilter;
  });

  const handleEventRegister = (eventId: number) => {
    setEventRegistrations((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold text-teal-900">Community</h1>
        <p className="text-lg text-teal-400">Connect with fellow trainers, share insights, and grow together.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-cream-100">
        {(['discussions', 'members', 'events'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-teal-400 hover:text-teal-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* DISCUSSIONS TAB */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          {/* Start Discussion Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-coral-500 text-white font-medium rounded-lg hover:bg-coral-700 transition-colors font-body">
              Start a Discussion
            </button>
          </div>

          {/* Filter Pill Navigation */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-700 text-white'
                    : 'bg-cream-100 text-teal-900 hover:bg-cream-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Discussion List */}
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white border border-cream-100 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${discussion.avatarColor} flex items-center justify-center text-white font-bold`}>
                    {discussion.initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-teal-900">{discussion.author}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(discussion.role)}`}>
                        {discussion.role}
                      </span>
                      {discussion.pinned && (
                        <span className="text-xs px-2 py-1 bg-coral-300 text-coral-700 rounded-full font-medium">
                          Pinned
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-teal-900 text-lg mb-2">{discussion.title}</h3>
                    <p className="text-teal-400 text-sm mb-3 line-clamp-1">{discussion.preview}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-teal-400">
                      <span className="inline-block bg-cream-100 px-2 py-1 rounded text-teal-900 font-medium">
                        {discussion.category}
                      </span>
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views.toLocaleString()} views</span>
                      <span>{discussion.timePosted}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <input
              type="text"
              placeholder="Search members by name..."
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-cream-100 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <div className="flex gap-2 flex-wrap">
              {memberFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMemberFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    memberFilter === filter
                      ? 'bg-teal-700 text-white'
                      : 'bg-cream-100 text-teal-900 hover:bg-cream-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Member Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white border border-cream-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                  {member.initials}
                </div>

                {/* Info */}
                <h3 className="font-heading font-bold text-teal-900 text-lg">{member.name}</h3>
                <div className="mt-1 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>

                <p className="text-sm text-teal-400 mb-3">{member.location}</p>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {member.specializations.map((spec) => (
                    <span key={spec} className="text-xs bg-cream-100 text-teal-900 px-2 py-1 rounded">
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-teal-400 mb-4">Joined {member.joinDate}</p>

                <button className="w-full px-4 py-2 bg-coral-500 text-white font-medium rounded-lg hover:bg-coral-700 transition-colors text-sm font-body">
                  View Profile
                </button>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-teal-400 font-body">No members found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventData.map((event) => (
              <div key={event.id} className="bg-white border border-cream-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-teal-400 mb-1">
                      {event.date} • {event.time} {event.timezone}
                    </p>
                    <h3 className="font-heading font-bold text-teal-900 text-lg">{event.title}</h3>
                  </div>
                </div>

                <p className="text-teal-400 text-sm mb-4">{event.description}</p>

                {event.trainer && (
                  <p className="text-sm text-teal-900 mb-4 font-medium">Hosted by {event.trainer}</p>
                )}

                <div className="mb-4 text-sm text-teal-400">
                  {event.attendees} attending
                </div>

                <button
                  onClick={() => handleEventRegister(event.id)}
                  className={`w-full px-4 py-2 font-medium rounded-lg transition-colors text-sm font-body ${
                    eventRegistrations[event.id]
                      ? 'bg-teal-100 text-teal-900 border border-teal-700 hover:bg-teal-200'
                      : 'bg-coral-500 text-white hover:bg-coral-700'
                  }`}
                >
                  {eventRegistrations[event.id] ? 'Registered' : 'Register'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
