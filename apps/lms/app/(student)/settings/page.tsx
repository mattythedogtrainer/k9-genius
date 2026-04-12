'use client';

import { useState } from 'react';
import { useAuth } from '@k9-genius/ui';
import Link from 'next/link';

type SettingsSection = 'profile' | 'security' | 'notifications' | 'privacy';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  specializations: string[];
}

interface NotificationPreferences {
  courseUpdates: boolean;
  communityReplies: boolean;
  newResources: boolean;
  certificationReminders: boolean;
  marketingEmails: boolean;
  weeklyProgressSummary: boolean;
  emailDigestFrequency: 'realtime' | 'daily' | 'weekly';
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showProgress: boolean;
  showCertifications: boolean;
}

const SPECIALIZATIONS = [
  'Obedience',
  'Agility',
  'Behavior',
  'Puppy Training',
  'Service Dogs',
  'Therapy Dogs',
];

export default function SettingsPage() {
  const auth = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Profile Form State
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: 'Matty',
    lastName: 'Couperthwaite',
    email: 'salesfunnelmatty@gmail.com',
    phone: '+1 (555) 123-4567',
    bio: 'Dog training enthusiast with 5+ years of experience in obedience and behavioral training.',
    location: 'Portland, OR',
    specializations: ['Obedience', 'Behavior'],
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    courseUpdates: true,
    communityReplies: true,
    newResources: true,
    certificationReminders: true,
    marketingEmails: false,
    weeklyProgressSummary: true,
    emailDigestFrequency: 'weekly',
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showProgress: true,
    showCertifications: true,
  });

  // Profile handlers
  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setProfileData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const handleProfileSave = () => {
    // Handle save logic here
    console.log('Profile data saved:', profileData);
  };

  // Security handlers
  const handleSecurityChange = (
    field: keyof typeof securityForm,
    value: string
  ) => {
    setSecurityForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = () => {
    // Handle password update logic here
    console.log('Password update:', securityForm);
  };

  // Notification handlers
  const toggleNotification = (key: keyof Omit<NotificationPreferences, 'emailDigestFrequency'>) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDigestFrequencyChange = (
    value: 'realtime' | 'daily' | 'weekly'
  ) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      emailDigestFrequency: value,
    }));
  };

  const handleNotificationSave = () => {
    // Handle notification preferences save logic here
    console.log('Notification preferences saved:', notificationPrefs);
  };

  // Privacy handlers
  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }));
  };

  const handleVisibilityChange = (value: 'public' | 'private') => {
    setPrivacySettings((prev) => ({
      ...prev,
      profileVisibility: value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-teal-900">Settings</h1>
        <p className="text-teal-400 mt-2 font-body">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl border border-cream-100 shadow-sm p-4 sticky top-4 space-y-2">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === 'profile'
                  ? 'bg-teal-50 text-teal-900'
                  : 'text-teal-700 hover:bg-cream-50'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === 'security'
                  ? 'bg-teal-50 text-teal-900'
                  : 'text-teal-700 hover:bg-cream-50'
              }`}
            >
              Account Security
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === 'notifications'
                  ? 'bg-teal-50 text-teal-900'
                  : 'text-teal-700 hover:bg-cream-50'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveSection('privacy')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === 'privacy'
                  ? 'bg-teal-50 text-teal-900'
                  : 'text-teal-700 hover:bg-cream-50'
              }`}
            >
              Privacy & Billing
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-coral-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    MC
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading font-bold text-teal-900 text-lg">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-sm text-teal-400 mt-1">
                      {profileData.email}
                    </p>
                    <button className="mt-3 px-4 py-2 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Personal Information
                </h3>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleProfileChange('firstName', e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleProfileChange('lastName', e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-400 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 cursor-not-allowed"
                    />
                    <p className="text-xs text-teal-400 mt-1">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleProfileChange('phone', e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        handleProfileChange('location', e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        handleProfileChange('bio', e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-3">
                      Specializations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALIZATIONS.map((spec) => (
                        <button
                          key={spec}
                          onClick={() => toggleSpecialization(spec)}
                          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                            profileData.specializations.includes(spec)
                              ? 'bg-teal-700 text-white'
                              : 'bg-cream-100 text-teal-700 hover:bg-cream-200'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProfileSave}
                  className="mt-8 px-6 py-2.5 bg-coral-500 hover:bg-coral-700 text-white font-heading font-medium text-sm rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Account Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Change Password
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) =>
                        handleSecurityChange('currentPassword', e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) =>
                        handleSecurityChange('newPassword', e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        handleSecurityChange('confirmPassword', e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePasswordUpdate}
                  className="mt-8 px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors"
                >
                  Update Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-teal-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-teal-400 mt-2 font-body">
                      Add an extra layer of security to your account by requiring a
                      verification code in addition to your password.
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      twoFactorEnabled
                        ? 'bg-teal-700'
                        : 'bg-cream-200'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Active Sessions
                </h3>

                <div className="space-y-4">
                  {/* Session 1 */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div>
                      <p className="font-heading font-semibold text-teal-900">
                        MacBook Pro
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Portland, OR — Current
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white hover:bg-cream-100 text-teal-700 border border-cream-100 font-medium text-sm rounded-lg transition-colors">
                      Revoke
                    </button>
                  </div>

                  {/* Session 2 */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div>
                      <p className="font-heading font-semibold text-teal-900">
                        iPhone 15
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Portland, OR — 2 hours ago
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white hover:bg-cream-100 text-teal-700 border border-cream-100 font-medium text-sm rounded-lg transition-colors">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              {/* Notification Preferences */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {/* Course Updates */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Course Updates
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Receive updates about courses you're enrolled in
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('courseUpdates')}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        notificationPrefs.courseUpdates
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationPrefs.courseUpdates
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Community Replies */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Community Replies
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Get notified when someone replies to your community posts
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('communityReplies')}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        notificationPrefs.communityReplies
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationPrefs.communityReplies
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* New Resources */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        New Resources
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Be notified about newly published learning materials
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('newResources')}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        notificationPrefs.newResources
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationPrefs.newResources
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Certification Reminders */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Certification Reminders
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Reminders about upcoming certification exams
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        toggleNotification('certificationReminders')
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        notificationPrefs.certificationReminders
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationPrefs.certificationReminders
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Marketing Emails
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Promotional emails about new courses and special offers
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('marketingEmails')}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        notificationPrefs.marketingEmails
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationPrefs.marketingEmails
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Weekly Progress Summary */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Weekly Progress Summary
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Get a weekly summary of your learning progress
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        toggleNotification('weeklyProgressSummary')
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        notificationPrefs.weeklyProgressSummary
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationPrefs.weeklyProgressSummary
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-cream-100">
                  <label className="block text-sm font-medium text-teal-700 mb-3">
                    Email Digest Frequency
                  </label>
                  <select
                    value={notificationPrefs.emailDigestFrequency}
                    onChange={(e) =>
                      handleDigestFrequencyChange(
                        e.target.value as
                          | 'realtime'
                          | 'daily'
                          | 'weekly'
                      )
                    }
                    className="w-full md:w-48 px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 font-body focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <button
                  onClick={handleNotificationSave}
                  className="mt-8 px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Billing Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Privacy Settings
                </h3>

                <div className="space-y-4">
                  {/* Profile Visibility */}
                  <div className="p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <p className="font-heading font-semibold text-teal-900 mb-3">
                      Profile Visibility
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="public"
                          checked={
                            privacySettings.profileVisibility === 'public'
                          }
                          onChange={() =>
                            handleVisibilityChange('public')
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-teal-900 font-body">
                          Public - Your profile is visible to other users
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={
                            privacySettings.profileVisibility === 'private'
                          }
                          onChange={() =>
                            handleVisibilityChange('private')
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-teal-900 font-body">
                          Private - Your profile is only visible to you
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Show Progress */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Show Progress
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Allow others to see your course progress
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyToggle('showProgress')
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        privacySettings.showProgress
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          privacySettings.showProgress
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Show Certifications */}
                  <div className="flex items-start justify-between p-4 bg-cream-50 rounded-lg border border-cream-100">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-teal-900">
                        Show Certifications
                      </p>
                      <p className="text-sm text-teal-400 mt-1 font-body">
                        Allow others to see your earned certifications
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyToggle('showCertifications')
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                        privacySettings.showCertifications
                          ? 'bg-teal-700'
                          : 'bg-cream-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          privacySettings.showCertifications
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Section */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Billing & Subscription
                </h3>

                <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-lg font-heading font-bold">
                        Professional Plan
                      </p>
                      <p className="text-sm opacity-90 font-body mt-1">
                        $29/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90 font-body">
                        Next billing date:
                      </p>
                      <p className="font-heading font-bold mt-1">
                        May 12, 2024
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <p className="text-sm font-body">
                      Payment method: Visa ending in 4242
                    </p>
                  </div>
                </div>

                <button className="w-full md:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors">
                  Manage Subscription
                </button>
              </div>

              {/* Data & Account Actions */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
                  Data & Account
                </h3>

                <div className="space-y-4">
                  <button className="w-full md:w-auto px-6 py-2.5 bg-white hover:bg-cream-50 text-teal-700 border border-teal-700 font-heading font-medium text-sm rounded-lg transition-colors">
                    Download My Data
                  </button>
                  <button className="w-full md:w-auto px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-heading font-medium text-sm rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>

                <p className="text-xs text-teal-400 mt-4 font-body">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
