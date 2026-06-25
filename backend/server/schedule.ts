import { ClassSchedule } from './../../frontend/src/types';

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
