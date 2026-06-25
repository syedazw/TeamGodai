/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Sparkles, Filter, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventModel } from '../types.ts';
import { getMediaUrl } from '../apiConfig.ts';

interface EventsViewProps {
  events: EventModel[];
  onEventClick: (eventId: string) => void;
}

export default function EventsView({ events, onEventClick }: EventsViewProps) {
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  
  // Identify slider-compatible events (either explicitly marked with autoScrollEnabled, or general upcoming events)
  const sliderEvents = events.filter(e => e.autoScrollEnabled || e.status === 'Upcoming');
  
  // Set automatic scrolling interval if there are slider events and autoscroll is enabled
  const hasSlider = sliderEvents.length > 0;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hasSlider) return;
    
    // Check if the currently active slide has auto-scrolling enabled or fallback to default auto-scroll
    const currentSlide = sliderEvents[activeSlideIdx];
    const shouldAutoScroll = currentSlide?.autoScrollEnabled ?? true;

    if (shouldAutoScroll) {
      timerRef.current = setInterval(() => {
        setActiveSlideIdx((prev) => (prev + 1) % sliderEvents.length);
      }, 5000); // 5 seconds rotation
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSlideIdx, hasSlider, sliderEvents]);

  // Sort events: Upcoming first, then Completed
  const upcomingSorted = [...events]
    .filter(e => e.status === 'Upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedSorted = [...events]
    .filter(e => e.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Completed sorted descending (latest first)

  const sortedEvents = [...upcomingSorted, ...completedSorted];

  // Apply filters
  const displayedEvents = sortedEvents.filter(e => {
    if (filter === 'All') return true;
    return e.status === filter;
  });

  const nextSlide = () => {
    setActiveSlideIdx((prev) => (prev + 1) % sliderEvents.length);
  };

  const prevSlide = () => {
    setActiveSlideIdx((prev) => (prev - 1 + sliderEvents.length) % sliderEvents.length);
  };

  return (
    <div id="events-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-805 pb-5 text-left">
        <div className="space-y-1.5">
          <span className="text-xs font-mono tracking-widest uppercase text-rose-500">Events Calendar</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wider text-white">Tournaments & Classes</h1>
          {/* <p className="text-zinc-400 text-sm max-w-xl">
            Register for regional championships, intensive weekend self-defense seminars, and view historical fight cards and results.
          </p> */}
        </div>
        
        {/* Filters control bar */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0 font-medium text-xs uppercase tracking-wider shrink-0 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setFilter('All')}
            className={`px-3.5 py-1.5 rounded-md cursor-pointer transition ${
              filter === 'All' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter('Upcoming')}
            className={`px-3.5 py-1.5 rounded-md cursor-pointer transition ${
              filter === 'Upcoming' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Upcoming ({events.filter(e => e.status === 'Upcoming').length})
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-3.5 py-1.5 rounded-md cursor-pointer transition ${
              filter === 'Completed' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Completed ({events.filter(e => e.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* 2. AUTO-MUTUAL ROTATING SLIDER (CAROUSEL) */}
      {hasSlider && filter === 'All' && (
        <section className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
          <div className="h-[320px] md:h-[420px] relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {sliderEvents.map((s, idx) => {
                if (idx !== activeSlideIdx) return null;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-left"
                  >
                    {/* Background image preview */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={getMediaUrl(s.posterUrl)}
                        alt={s.title}
                        className="w-full h-full object-cover grayscale opacity-45 brightness-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                    </div>

                    {/* Content overlays */}
                    <div className="relative z-10 max-w-2xl space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-red-600 text-[10px] font-bold tracking-widest uppercase rounded">
                          {s.status} Event
                        </span>
                        {/* {s.autoScrollEnabled && (
                          <span className="flex items-center space-x-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded uppercase font-mono">
                            <Clock className="h-3 w-3 animate-pulse" />
                            <span>Rotating Slider</span>
                          </span>
                        )} */}
                      </div>
                      
                      <h2 className="text-2xl md:text-4xl font-display font-extrabold uppercase text-white tracking-wide">
                        {s.title}
                      </h2>
                      
                      {/* <p className="text-zinc-300 text-sm hidden sm:line-clamp-2">
                        {s.content}
                      </p> */}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-medium pt-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-rose-500" />
                          <span>{s.date} ({s.time})</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-rose-500" />
                          <span>{s.location}</span>
                        </span>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => onEventClick(s.id)}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer"
                        >
                          Book & Review Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Nav Arrows */}
            <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-white rounded-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-white rounded-lg transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="absolute bottom-6 left-6 z-20 flex space-x-1.5">
              {sliderEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlideIdx === idx ? 'bg-rose-500 w-6' : 'bg-zinc-700 hover:bg-zinc-500'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. DYNAMIC EVENT GRIDS */}
      {displayedEvents.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-805 rounded-xl p-16 text-center text-zinc-400">
          <p className="text-base font-semibold">No active events found match the selection.</p>
          <p className="text-xs text-zinc-500 mt-1">Check back soon or visit our classes timetable.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-items-stretch">
          {displayedEvents.map((event) => {
            const isCompleted = event.status === 'Completed';
            return (
              <motion.div
                key={event.id}
                id={`event-card-${event.id}`}
                layout
                whileHover={{ y: -6 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between h-full text-left"
              >
                {/* Image and Status badge container */}
                <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden group border-b border-zinc-850">
                  <img
                    src={getMediaUrl(event.posterUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${
                      isCompleted 
                        ? 'bg-zinc-800 text-zinc-400 border border-zinc-750' 
                        : 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1 text-xs text-zinc-400">
                      <span className="flex items-center space-x-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{event.date}</span>
                      </span>
                      <span className="flex items-center space-x-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{event.location}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold uppercase text-white hover:text-rose-400 transition cursor-pointer" onClick={() => onEventClick(event.id)}>
                      {event.title}
                    </h3>
                    
                    {/* <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                      {event.content}
                    </p> */}
                  </div>

                  <div className="pt-2">
                    <button
                      id={`btn-read-more-${event.id}`}
                      onClick={() => onEventClick(event.id)}
                      className={`w-full py-2.5 rounded font-semibold text-xs tracking-wider uppercase border transition cursor-pointer ${
                        isCompleted
                          ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-rose-500 hover:text-rose-400'
                      }`}
                    >
                      Read More Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
