/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventModel, TrainerModel, ClassSchedule } from './types.ts';

export const INITIAL_TRAINERS: TrainerModel[] = [
  {
    id: 'trainer-1',
    name: 'Sensei Hiroshi Tanaka',
    specialty: 'Shotokan Karate & Self Defense',
    experience: '22 Years',
    bio: '6th Dan Black Belt Shotokan Karate and National Sparring Coach.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80'
  }
];

export const INITIAL_EVENTS: EventModel[] = [
  {
    id: 'event-1',
    title: 'Grand National Dojo Championship',
    date: '2026-06-25',
    time: '09:00 AM - 05:00 PM',
    location: 'Main Pavilion Hall',
    status: 'Upcoming',
    content: `## Grand National Dojo Championship

Join us for the most prestigious martial arts event of the season! The annual championship brings together students, black belts, and practitioners of various disciplines from across the region to compete in a demonstration of skill, honor, and mutual respect.

### Event Highlights
* **Kata Competitions**: Judged performances showing precision, timing, and poise.
* **Kumite Combat**: Action-packed point sparring matchups under standard safety rules.
* **Team Demonstrations**: Creative group synchronizations and self-defense exhibitions.
* **Trophies & Awards**: Elite recognition belts and certificates awarded to top scorers.

### Schedule of Events
* **08:00 AM**: Competitor Weigh-ins & Check-ins
* **09:30 AM**: Opening Ceremony & Bow-in
* **10:00 AM**: Junior Divisions (Kata & Sparring)
* **02:00 PM**: Black Belt Open Weight Showdown
* **04:30 PM**: Ceremony & Group Photo

*Prepare your gi, register from our desk, and push your limits!*`,
    posterUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&h=500&q=80',
    videoUrl: '',
    galleryUrls: [
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=400&h=300&q=80',
      'https://images.unsplash.com/photo-1509741102003-ed648eaa4062?auto=format&fit=crop&w=400&h=300&q=80'
    ],
    autoScrollEnabled: true
  },
  {
    id: 'event-2',
    title: 'Adaptive Self-Defense Masterclass',
    date: '2026-07-12',
    time: '11:00 AM - 02:00 PM',
    location: 'Studio A Center',
    status: 'Upcoming',
    content: `## Adaptive Self-Defense Masterclass

In this highly-focused practical course, we strip away the traditional performance elements and isolate pure, practical survival skills. Designed for individuals of all backgrounds and heights, you will learn to spot hazard zones, break common joint holds, and utilize bio-mechanics to escape physical threats.

### Core Curriculums
1. **De-escalation Mechanics**: Voice checks, non-threatening posturing, and high-awareness distancing.
2. **The Physics of Release**: Simple holds releases from double wrist grips, choke grabs, and collar pulls.
3. **Improvised Leverage**: Tapping into core muscle groups rather than standard arm strength to subdue or control space.
4. **Adrenaline Under Control**: Managing high-stress heart rates through practical breathing simulation.

Registration is open to participants aged 14 and over. No prior martial arts experience required. Loose, comfortable activewear is highly recommended.`,
    posterUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=500&q=80',
    videoUrl: '',
    galleryUrls: [
      'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=400&h=300&q=80'
    ],
    autoScrollEnabled: false
  },
  {
    id: 'event-3',
    title: 'Muay Thai Clinching & Sparring Retreat',
    date: '2026-04-18',
    time: '10:00 AM - 04:00 PM',
    location: 'Open Courtyard Ring',
    status: 'Completed',
    content: `## Muay Thai Clinching Retreat

A review of our memorable 1-day Muay Thai master workshop. Directed by Coach Marcus, this event focused extensively on intermediate and advanced clinching mechanics, sweep offsets, and knee striking geometry. 

### Key Lessons Covered
* **High-Clinch Dominance**: Hand placements, neck locks, and proper biceps-blocking.
* **Weight Transfers**: Moving an opponent's center of gravity to execute clean sweeps.
* **Deflections**: Catching elbows, redirecting knees, and resetting stance rapidly.

We want to thank our visiting practitioners of neighboring training halls for making this a challenging, high-respect sparring retreat. Pictures are preserved in our digital gallery board.`,
    posterUrl: 'https://images.unsplash.com/photo-1517438476312-12d7a0cf0804?auto=format&fit=crop&w=800&h=500&q=80',
    videoUrl: '',
    galleryUrls: [
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=400&h=300&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&h=300&q=80'
    ],
    autoScrollEnabled: true
  }
];

export const WEEKLY_SCHEDULE: ClassSchedule[] = [
  {
    day: 'Monday & Wednesday',
    classes: [
      { time: '06:30 AM - 07:30 AM', name: 'Sunrise Martial Fitness', instructor: 'Marcus Vance', level: 'All Levels' },
      { time: '05:00 PM - 06:00 PM', name: 'Youth Shotokan Karate', instructor: 'Hiroshi Tanaka', level: 'Beginner' },
      { time: '06:00 PM - 07:30 PM', name: 'Adult Karate Sparring', instructor: 'Hiroshi Tanaka', level: 'Intermediate' },
      { time: '07:30 PM - 09:00 PM', name: 'Brazilian Jiu-Jitsu (BJJ)', instructor: 'Isabella Silva', level: 'All Levels' }
    ]
  },
  {
    day: 'Tuesday & Thursday',
    classes: [
      { time: '05:00 PM - 06:00 PM', name: 'Kids Brazilian Jiu-Jitsu', instructor: 'Isabella Silva', level: 'Beginner' },
      { time: '06:00 PM - 07:15 PM', name: 'Muay Thai Kickboxing', instructor: 'Marcus Vance', level: 'All Levels' },
      { time: '07:15 PM - 08:30 PM', name: 'Advanced MMA Foundations', instructor: 'Marcus Vance', level: 'Intermediate' },
      { time: '08:30 PM - 09:30 PM', name: 'Tactical Krav Maga & Self-Defense', instructor: 'Hiroshi Tanaka', level: 'All Levels' }
    ]
  },
  {
    day: 'Friday & Saturday',
    classes: [
      { time: '05:30 PM - 07:00 PM', name: 'Open Grappling Sparring (Open Mat)', instructor: 'Isabella Silva', level: 'All Levels' },
      { time: '09:00 AM - 10:30 AM (Sat)', name: 'Morning Muay Thai Cardio', instructor: 'Marcus Vance', level: 'All Levels' },
      { time: '10:30 AM - 12:30 PM (Sat)', name: 'Black Belt Advanced Seminar', instructor: 'Hiroshi Tanaka', level: 'Intermediate' }
    ]
  }
];
