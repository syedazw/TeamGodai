/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Video, Image, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventModel } from '../types.ts';
import { getMediaUrl } from '../apiConfig.ts';
import {useParams, useNavigate} from 'react-router-dom';



const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const ext = url.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'mov', 'ogg'].includes(ext) || url.includes('/video/') || url.includes('video');
};

interface GalleryMediaItemProps {
  gUrl: string;
  idx: number;
  onClick: (mediaType: 'image' | 'video') => void;
  key?: React.Key;
}

function GalleryMediaItem({ gUrl, idx, onClick }: GalleryMediaItemProps) {
  const [mediaType, setMediaType] = React.useState<'image' | 'video' | 'loading'>(() => {
    if (!gUrl) return 'image';
    const cleanUrl = gUrl.split('?')[0];
    const ext = cleanUrl.split('.').pop()?.toLowerCase() || '';
    if (['mp4', 'webm', 'mov', 'ogg', 'm4v', '3gp', 'avi', 'mkv', 'qt'].includes(ext)) {
      return 'video';
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return 'image';
    }
    return 'loading';
  });

  React.useEffect(() => {
    if (mediaType !== 'loading') return;

    let isMounted = true;
    const checkType = async () => {
      try {
        const response = await fetch(gUrl, { method: 'HEAD' });
        if (!isMounted) return;
        const contentType = response.headers.get('content-type');
        if (contentType) {
          if (contentType.startsWith('video/')) {
            setMediaType('video');
            return;
          } else if (contentType.startsWith('image/')) {
            setMediaType('image');
            return;
          }
        }
      } catch (e) {
        // Fallback silently
      }

      // GET fallback if HEAD fails
      try {
        const response = await fetch(gUrl);
        if (!isMounted) return;
        const contentType = response.headers.get('content-type');
        if (contentType) {
          if (contentType.startsWith('video/')) {
            setMediaType('video');
            return;
          }
        }
      } catch (e) {
        // Fallback silently
      }

      const checkUrlIsVideo = (url: string): boolean => {
        const lower = url.toLowerCase();
        return (
          ['mp4', 'webm', 'mov', 'ogg', 'm4v', '3gp', 'avi', 'mkv', 'qt'].some((ext) =>
            lower.includes(`.${ext}`)
          ) ||
          lower.includes('/video/') ||
          lower.includes('video')
        );
      };

      if (isMounted) {
        setMediaType(checkUrlIsVideo(gUrl) ? 'video' : 'image');
      }
    };

    checkType();
    return () => {
      isMounted = false;
    };
  }, [gUrl, mediaType]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => {
        if (mediaType !== 'loading') {
          onClick(mediaType);
        }
      }}
      className="relative aspect-square bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center select-none"
    >
      {mediaType === 'loading' ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-zinc-750 border-t-rose-500 rounded-full animate-spin" />
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Loading</span>
        </div>
      ) : mediaType === 'video' ? (
        <div className="w-full h-full relative">
          <video
            src={getMediaUrl(gUrl)}
            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-300 pointer-events-none"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/35 hover:bg-black/15 transition flex items-center justify-center">
            <div className="w-9 h-9 bg-rose-600/90 rounded-full flex items-center justify-center shadow">
              <Video className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      ) : (
        <img
          src={getMediaUrl(gUrl)}
          alt={`Gallery ${idx + 1}`}
          className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-300"
        />
      )}
    </motion.div>
  );
}

interface EventDetailViewProps{
  events: EventModel[];
}

export default function EventDetailView({ events }: EventDetailViewProps) {
  const {id} = useParams();
  const navigate = useNavigate();

  const event = events.find(e => e.id == id) || null;

  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">
        <p className="text-lg">No event found or selected.</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
        >
          Return to Events
        </button>
      </div>
    );
  }

  return (
    <div id="event-detail-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
      {/* Back button */}
      <button
        id="btn-back-to-events"
        onClick={() => navigate('/events')}
        className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white cursor-pointer transition text-sm font-semibold uppercase tracking-wider group"
      >
        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to Events calendar</span>
      </button>

      {/* Grid: Header Poster / Information Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Poster Image (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-805 shadow-2xl bg-zinc-950">
            <img
              src={getMediaUrl(event.posterUrl)}
              alt={event.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 text-xs font-bold font-mono tracking-widest uppercase rounded-full shadow-lg ${
                event.status === 'Upcoming' 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {event.status} Event
              </span>
            </div>
          </div>
        </div>

        {/* Info Card Panel (Col 5) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">Quick-Info</span>
            <h1 className="font-display font-extrabold text-2xl uppercase tracking-wide text-white">
              {event.title}
            </h1>
          </div>

          <div className="border-t border-b border-zinc-800 py-4 space-y-3.5">
            <div className="flex items-start space-x-3.5">
              <Calendar className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Date Scheduled</h4>
                <p className="text-sm font-semibold text-zinc-100">{event.date}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <Clock className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Time range</h4>
                <p className="text-sm font-semibold text-zinc-100">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <MapPin className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Event Location</h4>
                <p className="text-sm font-semibold text-zinc-100">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-2.5">
              <div className="flex items-center space-x-2 text-zinc-300 font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Admission Free for Members</span>
              </div>
              <p>Valor combat club members are automatically registered. Guest passes are available at the front gates.</p>
            </div> */}
            {event.status === 'Upcoming' && (
              <a
                href={`https://wa.me/123456789?text=Hi%2C%20I%27d%20like%20to%20register%20for%20the%20upcoming%20event%3A%20${encodeURIComponent(event.title)}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center py-3 bg-red-600 hover:bg-red-700 font-bold rounded-xl text-white text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/20"
              >
                Inquire & Book via WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content description & markdown rendered details */}
      <section className="bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8 rounded-2xl">
        <h3 className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-rose-500 mb-6 font-bold pb-2 border-b border-zinc-800">
          <FileText className="h-4 w-4" />
          <span>Event Detail</span>
        </h3>
        
        {/* Simulating Markdown rendering layout styling */}
        <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
          {event.content.split('\n').map((para, i) => {
            const trimmed = para.trim();
            if (trimmed.startsWith('## ')) {
              return <h2 key={i} className="font-display font-bold text-xl uppercase tracking-wider text-white mt-6 mb-2">{trimmed.replace('## ', '')}</h2>;
            }
            if (trimmed.startsWith('### ')) {
              return <h3 key={i} className="font-display font-medium text-lg uppercase tracking-wider text-rose-400 mt-4 mb-2">{trimmed.replace('### ', '')}</h3>;
            }
            if (trimmed.startsWith('* **') || trimmed.startsWith('1. **')) {
              return <p key={i} className="pl-4 border-l-2 border-red-600 italic text-zinc-300 my-2">{trimmed}</p>;
            }
            if (!trimmed) return <div key={i} className="h-2"></div>;
            return <p key={i}>{trimmed}</p>;
          })}
        </div>
      </section>

      {/* 4. EVENT VIDEO PLAYBACK SECTION */}
      {event.videoUrl && (
        <section className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-4">
          <h3 className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-rose-500 mb-2 font-bold select-none">
            <Video className="h-4 w-4" />
            <span>Event Promotional Video</span>
          </h3>
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-xl aspect-video max-w-3xl mx-auto bg-zinc-950">
            <video
              src={getMediaUrl(event.videoUrl)}
              controls
              className="w-full h-full"
              poster={getMediaUrl(event.posterUrl)}
            />
          </div>
        </section>
      )}

      {/* 5. MULTIPLE GALLERY MEDIA CONTAINER */}
      {event.galleryUrls && event.galleryUrls.length > 0 && (
        <section className="space-y-4">
          <h3 className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-rose-500 font-bold select-none border-b border-zinc-800 pb-2 text-left">
            <Video className="h-4 w-4" />
            <span>Event Media Gallery Boards ({event.galleryUrls.length})</span>
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {event.galleryUrls.map((gUrl, idx) => (
              <GalleryMediaItem
                key={idx}
                gUrl={gUrl}
                idx={idx}
                onClick={(mediaType) => setSelectedMedia({ url: gUrl, type: mediaType })}
              />
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[85vh] object-contain border border-zinc-800 rounded-lg"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Enlarged gallery capture"
                  className="w-full h-auto max-h-[85vh] object-contain border border-zinc-805 rounded-lg"
                />
              )}
              <p className="absolute bottom-4 left-4 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-300 rounded font-mono">
                Click anywhere outside to dismiss
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
