/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventModel {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 12:00 PM"
  location: string;
  status: 'Upcoming' | 'Completed';
  content: string; // Markdown detailed content
  posterUrl: string;
  videoUrl?: string; // Optional MP4 upload
  galleryUrls?: string[]; // Optional multiple gallery images
  autoScrollEnabled?: boolean; // Manual/auto scroll enabled flag
}

export interface TrainerModel {
  id: string;
  name: string;
  specialty: string;
  experience: string; // e.g. "8 Years"
  bio: string; // Short bio
  imageUrl: string;
}

export interface InquiryModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
  timestamp: string;
}

export interface ClassSchedule {
  day: string;
  classes: {
    time: string;
    name: string;
    instructor: string;
    level: 'Beginner' | 'Intermediate' | 'All Levels';
  }[];
}
