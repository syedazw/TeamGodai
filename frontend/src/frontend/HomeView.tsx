/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {  Video, ArrowRight, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { EventModel, TrainerModel } from '../types.ts';
import bannerImage from '../assets/images/home.png';
import { getMediaUrl } from '../apiConfig.ts';


interface HomeViewProps {
  events: EventModel[];
  trainers: TrainerModel[];
  onViewChange: (path: string) => void;
  onEventClick: (eventId: string) => void;
}

export default function HomeView({ events, trainers, onViewChange, onEventClick }: HomeViewProps) {
  // Get upcoming events, up to 3 for feature section
  const upcomingEvents = events
    .filter(e => e.status === 'Upcoming')
    .slice(0, 3);

  // Fallback to latest events if no upcoming ones
  const featuredEvents = upcomingEvents.length > 0 ? upcomingEvents : events.slice(0, 3);

  // Get first 3 trainers for short bio
  const featuredTrainers = trainers.slice(0, 3);

  const stats = [
    { value: '35+', label: 'Years Of Experience' },
    { value: '1,500+', label: 'Active Pupils' },
    { value: '12', label: 'Gold Champions'},
    { value: '100%', label: 'Discipline Focus' }
  ];

  return (
    <div id="home-view-container" className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-800 text-white min-h-[80vh] flex items-center">
        {/* Ambient Dark Styling overlays */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/40 via-zinc-950 to-zinc-950"></div>
        
        {/* Background Visual Grid asset */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff003e_1px,transparent_1px)] [background-size:24px_24px] z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-24 grid md:grid-cols-12 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 space-y-6 text-left"
          >
            {/* <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-rose-500">
              <Shield className="h-4 w-4" />
              <span>Dojo & Sports Performance Academy</span>
            </div> */}
            
            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
              Forget Your Body,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
                Master Your Mind
              </span>
            </h1>

            {/* <p className="text-lg text-zinc-300 font-sans max-w-xl">
              From absolute beginners to sparring competitors, Team Godai Pakistan offers state-of-the-art combat coaching in Brazilian Jiu-Jitsu, Shotokan Karate, Boxing, and Muay Thai, helping you unlock maximum discipline, physical strength, and self-defense competence.
            </p> */}

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                id="hero-cta-join"
                onClick={() => onViewChange('/contact')}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 font-semibold rounded-lg text-white text-base shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Join Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="hero-cta-events"
                onClick={() => onViewChange('/events')}
                className="px-8 py-4 bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 hover:border-zinc-750 font-semibold rounded-lg text-zinc-200 text-base transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              >
                Explore Events
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-5 relative"
          >
            {/* Visual container showcasing physical discipline */}
            <div className=" relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 p-1">
              {/* <div className="absolute top-4 right-4 z-20 bg-zinc-950/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-red-500 border border-red-500/20 uppercase">
                Est. 2002
              </div> */}
              <img 
                src={bannerImage} 
                alt="Martial Arts Combat Training"
                className="w-full h-[300px] md:h-[400px] object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-rose-500">Next Masterclass</h4>
                  <p className="text-xs text-zinc-400">Join the self-defense workshop on July 12th</p>
                </div>
                <button 
                  onClick={() => onViewChange('/events')}
                  className="p-2.5 bg-red-600 rounded-lg hover:bg-red-700 text-white transition cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div> */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ACHIEVEMENTS & KEY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-xl hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
            >
              <div className="text-center text-3xl font-display font-extrabold text-red-500 tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-bold uppercase text-zinc-200 tracking-wider mb-1">
                {stat.label}
              </div>
              {/* <p className="text-xs text-zinc-400 font-sans">
                {stat.description}
              </p> */}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-zinc-800 pb-5 mb-10 text-left">
          <div className="space-y-1">
            <h2 className="text-xs font-mono tracking-widest uppercase text-rose-500">Upcoming Activities</h2>
            <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white">Featured Events</h3>
          </div>
          <button
            onClick={() => onViewChange('/events')}
            className="mt-4 sm:mt-0 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700/85 text-xs font-semibold uppercase tracking-wider text-zinc-300 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <span>Browse All Events</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-zinc-900/40 rounded-xl p-12 text-center border border-zinc-800">
            <p className="text-zinc-400 text-sm">No upcoming events rostered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -6 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full text-left"
              >
                <div className="relative aspect-video bg-zinc-950 overflow-hidden group">
                  <img
                    src={getMediaUrl(event.posterUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full ${
                      event.status === 'Upcoming' 
                        ? 'bg-rose-600 text-white shadow-md' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-xs text-zinc-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{event.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{event.location}</span>
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-display font-semibold uppercase text-white hover:text-rose-400 transition-colors cursor-pointer" onClick={() => onEventClick(event.id)}>
                      {event.title}
                    </h4>
                    
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {event.content}
                    </p>
                  </div>

                  <button
                    onClick={() => onEventClick(event.id)}
                    className="w-full text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 font-semibold rounded border border-zinc-800 hover:border-zinc-700 text-xs uppercase text-rose-500 hover:text-rose-400 tracking-wider transition cursor-pointer"
                  >
                    Read Event Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 4. FEATURED TRAINERS */}
      {/* <section className="bg-zinc-900/30 border-y border-zinc-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-zinc-800 pb-5 mb-10 text-left">
            <div className="space-y-1">
              <h2 className="text-xs font-mono tracking-widest uppercase text-rose-500">Elite Combat Instructors</h2>
              <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white">Featured Coaches</h3>
            </div>
            <button
              onClick={() => onViewChange('/trainers')}
              className="mt-4 sm:mt-0 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold uppercase tracking-wider text-zinc-300 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Meet Roster</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTrainers.map((trainer, idx) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition duration-300 flex flex-col text-left"
              >
                <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent p-6 pt-12">
                    <span className="px-2.5 py-1 bg-red-600/90 text-[10px] font-bold font-mono tracking-widest rounded uppercase text-white">
                      {trainer.specialty}
                    </span>
                    <h4 className="text-lg font-display font-bold uppercase text-white mt-2 break-words">
                      {trainer.name}
                    </h4>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-400 italic mb-4 break-words">
                     "{trainer.bio}"
                  </p>
                  <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase tracking-widest font-mono">Experience</span>
                    <span className="text-rose-500 font-bold">{trainer.experience} Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 5. PROMOTION ACCENTS (CALL TO ACTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-red-950/20 to-rose-950/30 border border-rose-800/30 p-8 md:p-12 text-center md:text-left md:flex items-center justify-between overflow-hidden">
          {/* Subtle flare effect */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl z-0"></div>
          
          <div className="space-y-3 relative z-10 max-w-xl text-left">
            <h3 className="font-display font-medium text-2xl uppercase tracking-widest text-rose-500">
              Not Sure Which Class Fits You?
            </h3>
            <p className="text-zinc-300 font-sans text-sm md:text-base">
              Speak with a certified instructor today. We provide physical training to align your self-defense and health training.
            </p>
          </div>

          <div className="mt-6 md:mt-0 relative z-10 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 shrink-0">
            <button
              onClick={() => onViewChange('/contact')}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 font-semibold rounded-lg text-white text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Request Call Back
            </button>
            <button
              onClick={() => onViewChange('/about')}
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700/80 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Classes Info
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
