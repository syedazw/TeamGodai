/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Flame, BookOpen,  HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import promotionalvideo from '../assets/images/videos/5.mp4';

export default function AboutView() {
  const values = [
    {
      icon: Flame,
      title: 'Unyielding Discipline',
      description: 'True strength is internal. We build constant, focused habits that reinforce life outside the Dojo walls.'
    },
    {
      icon: HeartHandshake,
      title: 'Mutual Respect',
      description: 'Zero ego. Every practitioner from white belt to black belt bows, supports, and learns from one another.'
    },
    {
      icon: Shield,
      title: 'Practical Safety',
      description: 'We prioritize safe martial arts forms. We learn locks, leverage, and self-defense tailored to avoid injuries.'
    },
    {
      icon: BookOpen,
      title: 'Continuous Mastery',
      description: 'Martial arts is a lifelong journey. We train for progression, self-mastery, first-generation integrity, and stamina.'
    }
  ];

  return (
    <div id="about-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 text-left">
      
      {/* 1. HERO DESCRIPTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-mono tracking-widest uppercase text-rose-500">TEAM GODAI PAKISTAN</span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-wider text-white">
              Be Passionate, <br />Strengthen Your Body.
            </h1>
          </div>
          
          <p className="text-zinc-300 text-sm leading-relaxed font-sans">
            Founded in 2001, Team Godai Pakistan Association has stood as a beacon of discipline, physical excellence, self defence, street fight and kata's. 
            Our core philosophy is simple: martial arts is not merely about physical combat, but about the absolute mastery of oneself.
          </p>
          
          <p className="text-zinc-400 text-sm leading-relaxed font-sans">
            Whether you are on our mats to master a perfect high-power Karate stance, Brazilian Jiu-Jitsu guard passes, build kickboxing cardiorespiratory stamina, 
            or unlock crucial daily self-defense skills, our supportive instructors is with you every step of the way. We create a competitive, yet supportive community.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="block text-2xl font-display font-bold text-red-500">25+ Years</span>
              <span className="block text-xs text-zinc-400 uppercase font-mono mt-1">Stamina Coaching</span>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="block text-2xl font-display font-bold text-red-500">1,000+ Students</span>
              <span className="block text-xs text-zinc-400 uppercase font-mono mt-1">Enrolled</span>
            </div>
          </div>
        </div>

        {/* Video Presentation Section */}
        
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl aspect-video bg-zinc-950">
            {/* Auto-play ambient combat martial arts background loops (mute essential for modern web autoplay) */}
            <video
              src={promotionalvideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter contrast-125 brightness-75 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 rounded-xl">
              <span className="text-[9px] font-mono tracking-widest uppercase text-rose-500 font-bold block mb-1">
                Autoplay Promotional Clip
              </span>
              <p className="text-xs text-white uppercase font-display font-semibold tracking-wide">
                Team Godai Pakistan Session
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR VISION & PHILOSOPHY VALUES */}
      <section className="bg-zinc-900/30 border-y border-zinc-805 py-12">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs font-mono tracking-widest uppercase text-rose-500">Our Core Pillars</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase text-white tracking-wider">
            Our Principles & Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition"
              >
                <div className="bg-red-950/40 w-10 h-10 rounded-lg flex items-center justify-center border border-red-500/20 text-red-500 mb-4 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold uppercase text-sm text-white tracking-wider mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {v.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. OUR DAILY ROUTINE SCHEDULE */}
      <section className="bg-zinc-900/30 border-y border-zinc-800 py-12">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs font-mono tracking-widest uppercase text-rose-500">Our Schedule</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase text-white tracking-wider">
            Check Our Daily Routine Schedule
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
            Find below our routine classes mapped across whole week.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-4 text-xs font-mono tracking-wider font-bold text-rose-500 uppercase">Day</th>
                  <th className="p-4 text-xs font-mono tracking-wider font-bold text-zinc-300 uppercase">08:00 PM</th>
                  <th className="p-4 text-xs font-mono tracking-wider font-bold text-zinc-300 uppercase">09:00 PM</th>
                  <th className="p-4 text-xs font-mono tracking-wider font-bold text-zinc-300 uppercase">10:00 PM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {[
                  { day: 'MON', slots: ['GRIND', 'GRIND', 'GRIND'] },
                  { day: 'TUE', slots: ['FIT STATION', 'FIT STATION', 'FIT STATION'] },
                  { day: 'WED', slots: ['GRIND', 'GRIND', 'GRIND'] },
                  { day: 'THU', slots: ['FIT STATION', 'FIT STATION', 'FIT STATION'] },
                  { day: 'FRI', slots: ['GRIND', 'GRIND', 'GRIND'] },
                  { day: 'SAT', slots: ['FIT STATION', 'FIT STATION', 'FIT STATION'] }
                ].map((row) => (
                  <tr key={row.day} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 text-xs font-mono font-bold text-zinc-400 bg-zinc-900/10 border-r border-zinc-900/40">{row.day}</td>
                    {row.slots.map((slot, sIdx) => (
                      <td key={sIdx} className="p-4">
                        {slot ? (
                          <div className={`inline-block px-3 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${
                            slot === 'GRIND' 
                              ? 'bg-rose-950/30 border-rose-500/20 text-rose-400' 
                              : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300'
                          }`}>
                            {slot}
                          </div>
                        ) : (
                          <span className="text-zinc-700 font-mono text-[10px] select-none">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. HISTORIC TIMELINE */}
      {/* <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono tracking-widest uppercase text-rose-500">Pathway of Integrity</span>
          <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">Our Heritage & Timeline</h2>
        </div>

        <div className="border-l-2 border-zinc-800 space-y-8 pl-6 relative">
          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-red-600 border border-zinc-950"></div>
            <div>
              <span className="text-xs font-mono tracking-wider font-bold text-rose-500">2002 — The First Dojo Mat</span>
              <p className="text-sm font-semibold text-white mt-1">Academy Foundation</p>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Founded by Sensei Hiroshi Tanaka inside a rented store hall with only two training mates and 100 sq ft is tatami safety mats.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-zinc-800 hover:bg-red-500 transition-colors border border-zinc-950"></div>
            <div>
              <span className="text-xs font-mono tracking-wider font-bold text-rose-500">2010 — Roster Expansion</span>
              <p className="text-sm font-semibold text-white mt-1">Elite Specialists onboarding</p>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Introduced Brazilian Jiu-Jitsu (BJJ) and professional Muay Thai kickboxing classes under Professor Isabella and Coach Marcus.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-zinc-800 hover:bg-red-500 transition-colors border border-zinc-950"></div>
            <div>
              <span className="text-xs font-mono tracking-wider font-bold text-rose-500">2019 — Championship Golden Era</span>
              <p className="text-sm font-semibold text-white mt-1">National Recognition</p>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Academy team takes 1st place in regional sparring and BJJ tournaments, winning 12 championship gold cups in a single season.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-red-600 border border-zinc-950"></div>
            <div>
              <span className="text-xs font-mono tracking-wider font-bold text-rose-500">2026 — NextGen Digital Hub</span>
              <p className="text-sm font-semibold text-white mt-1">Complete Dynamic Media Platform</p>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Deploying custom dynamic digital portals to streamline instructor schedules, seminars logbooks, and remote uploads.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
