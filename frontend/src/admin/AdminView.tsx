/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, Shield, Calendar, Users, MessageSquare, Plus, 
  Trash2, Edit, Save, X, UploadCloud, CheckCircle2, AlertTriangle, Monitor,
  Sparkles, FileText, Settings, Video, Image as ImageIcon, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventModel, TrainerModel, InquiryModel } from '../types.ts';
import { getApiUrl, getMediaUrl } from '../apiConfig.ts';

interface AdminViewProps {
  events: EventModel[];
  trainers: TrainerModel[];
  token: string | null;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onLogout: () => void;
  // CRUD actions passed down
  onCreateEvent: (event: Partial<EventModel>) => Promise<boolean>;
  onUpdateEvent: (id: string, event: Partial<EventModel>) => Promise<boolean>;
  onDeleteEvent: (id: string) => Promise<boolean>;
  onCreateTrainer: (trainer: Partial<TrainerModel>) => Promise<boolean>;
  onUpdateTrainer: (id: string, trainer: Partial<TrainerModel>) => Promise<boolean>;
  onDeleteTrainer: (id: string) => Promise<boolean>;
}

const isPastDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  eventDate.setHours(0, 0, 0, 0);

  return eventDate < today;
};

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const ext = url.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'mov', 'ogg'].includes(ext) || url.includes('/video/') || url.includes('video');
};

function AdminGalleryMediaItem({ gUrl, onRemove }: { gUrl: string; onRemove: () => void; key?: React.Key }) {
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
    <div className="relative group rounded overflow-hidden aspect-square h-14 bg-zinc-900 border border-zinc-800 flex items-center justify-center select-none">
      {mediaType === 'loading' ? (
        <div className="w-4 h-4 border border-zinc-700 border-t-rose-500 rounded-full animate-spin" />
      ) : mediaType === 'video' ? (
        <div className="relative w-full h-full">
          <video
            src={getMediaUrl(gUrl)}
            className="w-full h-full object-cover pointer-events-none"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-1 right-1 bg-rose-600/90 p-0.5 rounded flex items-center justify-center">
            <Video className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
      ) : (
        <img src={getMediaUrl(gUrl)} className="w-full h-full object-cover" alt="" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
      >
        <Trash2 className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}

// Reusable nested File Uploader component supporting drag-and-drop & multi-uploads
interface FileUploaderProps {
  label: string;
  accept: string;
  onUploadSuccess: (url: string) => void;
  token: string;
  multiple?: boolean;
}

function FileUploader({ label, accept, onUploadSuccess, token, multiple = false }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [dragActive, setDragActive] = useState(false);

  const processFiles = async (fileList: FileList) => {
    if (fileList.length === 0) return;
    setUploading(true);
    setProgress({ current: 0, total: fileList.length });

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(getApiUrl('/api/upload'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          onUploadSuccess(data.url);
        } else {
          const err = await response.json();
          alert(`Upload failed for "${file.name}": ${err.error || 'Server error'}`);
        }
      } catch (error) {
        alert(`Upload failed for "${file.name}" due to network difficulty.`);
      }
      setProgress(prev => ({ ...prev, current: i + 1 }));
    }
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative p-4 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer min-h-[140px] select-none ${
        dragActive 
          ? 'border-rose-500 bg-rose-500/5 text-rose-400 font-bold' 
          : 'border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/40 hover:border-zinc-700 text-zinc-400'
      }`}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <UploadCloud className={`h-8 w-8 ${dragActive ? 'text-rose-500 animate-bounce' : 'text-zinc-500'}`} />
      <div className="space-y-1">
        <span className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-300">
          {label}
        </span>
        <span className="block text-[10px] text-zinc-500 font-normal">
          Drag & drop, or <span className="text-rose-500 underline">browse your folders</span>
        </span>
      </div>
      {uploading && (
        <div className="w-full max-w-[150px] bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-1">
          <div 
            className="bg-rose-500 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}
      {uploading && (
        <span className="text-[9px] text-amber-500 font-medium">
          Uploading {progress.current} of {progress.total} items...
        </span>
      )}
    </div>
  );
}

export default function AdminView({
  events, trainers, token, onLogin, onLogout,
  onCreateEvent, onUpdateEvent, onDeleteEvent,
  onCreateTrainer, onUpdateTrainer, onDeleteTrainer
}: AdminViewProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'trainers' | 'inquiries'>('dashboard');

  // Dashboard calculations
  const [inquiries, setInquiries] = useState<InquiryModel[]>([]);
  const [inqLoading, setInqLoading] = useState(false);

  // States for Events CRUD form
  const [evtFormOpen, setEvtFormOpen] = useState(false);
  const [evtEditingId, setEvtEditingId] = useState<string | null>(null);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtStatus, setEvtStatus] = useState<'Upcoming' | 'Completed'>('Upcoming');
  const [evtContent, setEvtContent] = useState('');
  const [evtPosterUrl, setEvtPosterUrl] = useState('');
  const [evtVideoUrl, setEvtVideoUrl] = useState('');
  const [evtGalleryUrls, setEvtGalleryUrls] = useState<string[]>([]);
  const [evtAutoScroll, setEvtAutoScroll] = useState(false);

  // States for Trainers CRUD form
  const [trnFormOpen, setTrnFormOpen] = useState(false);
  const [trnEditingId, setTrnEditingId] = useState<string | null>(null);
  const [trnName, setTrnName] = useState('');
  const [trnSpecialty, setTrnSpecialty] = useState("");
  const [trnExperience, setTrnExperience] = useState("");
  const [trnBio, setTrnBio] = useState('');
  const [trnImageUrl, setTrnImageUrl] = useState('');

  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    engine: string;
    statusMessage: string;
    host: string;
    database: string;
    port: string | number;
    ssl: boolean;
  } | null>(null);

  // Fetch db status
  const pullDbStatus = async () => {
    try {
      const res = await fetch(getApiUrl('/api/database/status'));
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch inquiries helper
  const pullInquiries = async () => {
    if (!token) return;
    setInqLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
          const list = await response.json();
          setInquiries(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInqLoading(false);
    }
  };

  useEffect(() => {
    pullDbStatus();
    if (token) {
      pullInquiries();
    }
  }, [token, activeTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await onLogin(username, password);
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    }
  };

  // Event save actions (Create or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtDate  || !evtContent) {
      alert('Please fill out all required fields.');
      return;
    }

    if (isPastDate(evtDate) && evtStatus === 'Upcoming') {
      alert('Past events cannot be marked as Upcoming. Please select Completed status.');
      return;
    }

    const payload: Partial<EventModel> = {
      title: evtTitle,
      date: evtDate,
      time: evtTime || 'TBD',
      location: evtLocation || 'Academy Hall',
      status: evtStatus,
      content: evtContent,
      posterUrl: evtPosterUrl || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&h=500&q=80',
      videoUrl: evtVideoUrl,
      galleryUrls: evtGalleryUrls,
      autoScrollEnabled: evtAutoScroll
    };

    let success = false;
    if (evtEditingId) {
      success = await onUpdateEvent(evtEditingId, payload);
    } else {
      success = await onCreateEvent(payload);
    }

    if (success) {
      alert('Event settings compiled successfully.');
      resetEventForm();
    }
  };

  const resetEventForm = () => {
    setEvtFormOpen(false);
    setEvtEditingId(null);
    setEvtTitle('');
    setEvtDate('');
    setEvtTime('');
    setEvtLocation('');
    setEvtStatus('Upcoming');
    setEvtContent('');
    setEvtPosterUrl('');
    setEvtVideoUrl('');
    setEvtGalleryUrls([]);
    setEvtAutoScroll(false);
  };

  const startEditEvent = (evt: EventModel) => {
    setEvtEditingId(evt.id);
    setEvtTitle(evt.title);
    setEvtDate(evt.date);
    setEvtTime(evt.time);
    setEvtLocation(evt.location);
    setEvtStatus(evt.status);
    setEvtContent(evt.content);
    setEvtPosterUrl(evt.posterUrl);
    setEvtVideoUrl(evt.videoUrl || '');
    setEvtGalleryUrls(evt.galleryUrls || []);
    setEvtAutoScroll(evt.autoScrollEnabled || false);
    setEvtFormOpen(true);
  };

  const handleDeleteEventClick = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the event: "${name}"?`)) {
      const ok = await onDeleteEvent(id);
      if (ok) alert('Event wiped successfully.');
    }
  };

  // Trainer save actions (Create or Update)
  const handleSaveTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trnName || !trnBio) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload: Partial<TrainerModel> = {
      name: trnName,
      specialty: trnSpecialty,
      experience: trnExperience,
      bio: trnBio,
      imageUrl: trnImageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80'
    };

    let success = false;
    if (trnEditingId) {
      success = await onUpdateTrainer(trnEditingId, payload);
    } else {
      success = await onCreateTrainer(payload);
    }

    if (success) {
      alert('Trainer roster details compiled successfully.');
      resetTrainerForm();
    }
  };

  const resetTrainerForm = () => {
    setTrnFormOpen(false);
    setTrnEditingId(null);
    setTrnName('');
    setTrnSpecialty('');
    setTrnExperience('');
    setTrnBio('');
    setTrnImageUrl('');
  };

  const startEditTrainer = (trainer: TrainerModel) => {
    setTrnEditingId(trainer.id);
    setTrnName(trainer.name);
    setTrnSpecialty(trainer.specialty);
    setTrnExperience(trainer.experience);
    setTrnBio(trainer.bio);
    setTrnImageUrl(trainer.imageUrl);
    setTrnFormOpen(true);
  };

  const handleDeleteTrainerClick = async (id: string, name: string) => {
    if (confirm(`Roster off trainer ${name}?`)) {
      const ok = await onDeleteTrainer(id);
      if (ok) alert('Trainer details cleared.');
    }
  };

  const handleDeleteInquiryClick = async (id: string) => {
    if (!token) return;
    if (confirm('Clear this request from logs?')) {
      try {
        const res = await fetch(getApiUrl(`/api/contact/${id}`), {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          pullInquiries();
        }
      } catch (e) {
        alert('Failed to delete inquiry');
      }
    }
  };

  // Add standard gallery url helper
  const addGalleryUrlString = (url: string) => {
    setEvtGalleryUrls((prev) => [...prev, url]);
  };

  const removeGalleryUrlIdx = (idxToRemove: number) => {
    setEvtGalleryUrls((prev) => prev.filter((_, i) => i !== idxToRemove));
  };

  // -------------------- AUTH CHECK RENDER --------------------
  if (!token) {
    return (
      <div id="admin-login-panel" className="max-w-md mx-auto px-4 py-24 text-left">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-6 shadow-2xl relative"
        >
          {/* Accent lighting */}
          <div className="absolute inset-x-0 top-0 h-1 bg-rose-600 rounded-t-2xl"></div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl uppercase tracking-wider text-white">
              Team Godai Pakistan
            </h1>
            <p className="text-xs text-zinc-400">
              Enter administrative credentials to access events registry, staff rosters, and client message submissions list.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 text-rose-400 text-xs rounded-lg flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2 text-xs font-semibold">
              <label className="text-zinc-300 uppercase tracking-wider block">Admin Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="default 'admin'"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 transition font-normal"
              />
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <label className="text-zinc-300 uppercase tracking-wider block">Admin Control Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="default config 'admin123'"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 transition font-normal"
              />
            </div>

            <button
              id="btn-admin-submit"
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 font-bold rounded-xl text-white text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/10 cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // -------------------- AUTHENTICATED ADMIN DASHBOARD RENDER --------------------
  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* 1. ADMIN PANEL WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900 border border-zinc-800 px-6 py-5 rounded-2xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-rose-500">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-mono tracking-widest uppercase font-bold">Admin Portal</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl uppercase tracking-wider text-white">
            Academy Control Center
          </h1>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* 2. STATS OVERVIEWS METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-805/80 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Scheduled events</span>
          <p className="text-2xl font-display font-extrabold text-white mt-1">{events.length}</p>
          <p className="text-[10px] text-zinc-400 mt-1">{events.filter(e => e.status === 'Upcoming').length} Active, {events.filter(e => e.status === 'Completed').length} Past</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-805/80 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Trainer Staff</span>
          <p className="text-2xl font-display font-extrabold text-white mt-1">{trainers.length}</p>
          <p className="text-[10px] text-zinc-400 mt-1">Certified Black Belts active</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-805/80 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Client Submissions</span>
          <p className="text-2xl font-display font-extrabold text-white mt-1">{inquiries.length}</p>
          <p className="text-[10px] text-zinc-400 mt-1">Pending front desk approval</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-805/80 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Database Status</span>
          {dbStatus?.connected ? (
            <p className="text-2xl font-display font-extrabold text-emerald-400 mt-1 uppercase text-sm flex items-center space-x-1.5 pt-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 font-bold" />
              <span>MySQL Online</span>
            </p>
          ) : (
            <p className="text-2xl font-display font-extrabold text-amber-500 mt-1 uppercase text-sm flex items-center space-x-1.5 pt-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500 font-bold" />
              <span>JSON Fallback</span>
            </p>
          )}
          <p className="text-[10px] text-zinc-400 mt-1 truncate">{dbStatus ? (dbStatus.connected ? `Host: ${dbStatus.host}` : 'No MySQL Connected') : 'Loading status...'}</p>
        </div>
      </div>

      {/* 3. SWITCHER COMPONENT TABS MAPS */}
      <div className="flex border-b border-zinc-800 pb-px text-xs font-bold uppercase tracking-wider gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-3 border-b-2 transition ${
            activeTab === 'dashboard' ? 'border-red-600 text-red-500' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Overview Dashboard
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-3 border-b-2 transition-all ${
            activeTab === 'events' ? 'border-red-600 text-red-500 font-extrabold' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Event Management ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('trainers')}
          className={`px-4 py-3 border-b-2 transition-all ${
            activeTab === 'trainers' ? 'border-red-600 text-red-500 font-extrabold' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Trainers ({trainers.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-3 border-b-2 transition-all ${
            activeTab === 'inquiries' ? 'border-red-600 text-red-500 font-extrabold' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          WhatsApp Logs ({inquiries.length})
        </button>
      </div>

      {/* 4. ACTIVE TAB CONTROLS RENDERING */}
      <div className="space-y-6">

        {/* ==================== A: OVERVIEW DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-805 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-rose-600/5 text-[8px] font-mono tracking-widest text-rose-500 rounded-bl border-l border-b border-zinc-800 uppercase">
                ENGINE DIAGNOSTICS
              </div>
              <div className="flex flex-col md:flex-row items-start md:space-x-5 gap-4">
                <div className={`p-3 rounded-xl shrink-0 border ${dbStatus?.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                  <Settings className="h-6 w-6" />
                </div>
                <div className="space-y-2 w-full">
                  <h3 className="font-display font-extrabold text-base uppercase tracking-wider text-white">
                    Database Storage Engine: {dbStatus?.connected ? 'MySQL Operational (Active)' : 'Local Offline Files (Fallback Active)'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                    {dbStatus?.connected ? (
                      <span>The academy is fully connected to your remote MySQL server. Any changes or updates made to custom events, trainers roster, or incoming WhatsApp client inquiries are queried directly and indexed securely inside your relational database schema.</span>
                    ) : (
                      <span>The website is currently operating on an offline-safe local JSON storage fallback. To link your customized <strong>MySQL database</strong>, you must declare your connection credentials as environment variables.</span>
                    )}
                  </p>

                  <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-zinc-950 rounded-xl space-y-1 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">Active storage engine</span>
                      <span className="font-bold text-white text-[11px] font-sans truncate block">{dbStatus?.engine || 'Local Fallback'}</span>
                    </div>
                    <div className="p-3.5 bg-zinc-950 rounded-xl space-y-1 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">MySQL Host / Port</span>
                      <span className="text-white font-mono text-[11px] truncate block font-bold">{dbStatus?.host || 'Not configured'}:{dbStatus?.port || '3306'}</span>
                    </div>
                    <div className="p-3.5 bg-zinc-950 rounded-xl space-y-1 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">Target Database</span>
                      <span className="text-white font-sans text-[11px] font-semibold truncate block">{dbStatus?.database || 'Not configured'}</span>
                    </div>
                    <div className="p-3.5 bg-zinc-950 rounded-xl space-y-1 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">SSL Security Link</span>
                      <span className={`font-mono text-[11px] font-bold ${dbStatus?.ssl ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {dbStatus?.ssl ? 'ENABLED (SSL)' : 'DISABLED'}
                      </span>
                    </div>
                  </div>

                  {!dbStatus?.connected && (
                    <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl text-xs text-amber-500 leading-relaxed space-y-2 mt-4 font-sans">
                      <p className="font-bold flex items-center space-x-1.5 uppercase tracking-wider text-[11px] text-amber-400">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>Step-By-Step: Where to configure your MySQL connection credentials</span>
                      </p>
                      <div className="space-y-2 text-zinc-300">
                        <p>To connect the database, add the following climate variables to your runtime environment:</p>
                        <div className="bg-zinc-950 p-3 rounded-lg font-mono text-[10px] text-amber-400/90 border border-zinc-850 overflow-x-auto">
                          MYSQL_HOST = "your-database-server-ip-or-host"<br />
                          MYSQL_USER = "your-database-username"<br />
                          MYSQL_PASSWORD = "your-database-password"<br />
                          MYSQL_DATABASE = "your-database-name"<br />
                          MYSQL_PORT = "3306" (Defaults to 3306)<br />
                          MYSQL_SSL = "true" (Optional/Set to true if connecting to Secure SSL Clouds like PlanetScale/Cloud SQL)
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-zinc-400 mt-2 text-[11px]">
                          <li><span className="text-zinc-300 font-bold">Local Host Machine:</span> Add these credentials directly to a new <code className="text-amber-400 font-mono font-bold bg-zinc-950 px-1 py-0.5 rounded">.env</code> text file in the app root folder.</li>
                          <li><span className="text-zinc-300 font-bold">AI Studio / Cloud Run Preview:</span> Open the AI Studio <span className="text-rose-400 font-bold">Settings Menu (Gear Icon) &gt; Environment Variables Secrets</span> section inside the sidebar, input each of the keys and their actual values, save, and then click <span className="text-rose-400 font-bold">Restart Dev Server</span>.</li>
                          <li><span className="text-zinc-300 font-bold">Instant Setup Seeding:</span> On successfully verifying connection, the backend immediately builds the necessary SQL tables schema (<code>events</code>, <code>trainers</code>, <code>inquiries</code>) and automatically migrates all local list data records over to your SQL pool so you can start right away without losing anything!</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick Actions Panel (Col 4) */}
            <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-rose-500 border-b border-zinc-800 pb-2">
                Quick Registry Actions
              </h3>
              <p className="text-zinc-500 text-xs font-medium">Use these links to immediately add events, trainers or review logs.</p>
              
              <div className="space-y-2 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => { setActiveTab('events'); resetEventForm(); setEvtFormOpen(true); }}
                  className="flex items-center justify-between w-full p-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition rounded-xl cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-rose-500" />
                    <span>Create New Event</span>
                  </span>
                  <Plus className="h-4 w-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => { setActiveTab('trainers'); resetTrainerForm(); setTrnFormOpen(true); }}
                  className="flex items-center justify-between w-full p-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition rounded-xl cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-rose-500" />
                    <span>Register New Trainer</span>
                  </span>
                  <Plus className="h-4 w-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="flex items-center justify-between w-full p-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition rounded-xl cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-rose-500" />
                    <span>Review WhatsApp Logs</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Recent Contact Logs (Col 8) */}
            <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-rose-500">
                  Recent WhatsApp Inquiries Log
                </h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-rose-500 hover:underline hover:text-rose-450 uppercase font-bold"
                >
                  See All Logs
                </button>
              </div>

              {inqLoading ? (
                <p className="text-zinc-500 text-xs py-4">Sync-loading contact inquiries...</p>
              ) : inquiries.length === 0 ? (
                <p className="text-zinc-400 text-xs py-4">No submissions logged today. Forms are online.</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="p-4 bg-zinc-950/80 border border-zinc-805/90 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white uppercase">{inq.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{new Date(inq.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[11px] text-rose-500 font-mono tracking-wider uppercase font-bold">
                        Targeting: {inq.program}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 italic">
                        "{inq.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* ==================== B: EVENTS LIST & FORMS CRUD ==================== */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            
            {/* Form Toggle Accordion/Trigger */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">Events database</h3>
              <button
                onClick={() => { if (evtFormOpen) { resetEventForm(); } else { setEvtFormOpen(true); } }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center space-x-1.5 cursor-pointer"
              >
                {evtFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{evtFormOpen ? 'Collapse Form' : 'Register New Event'}</span>
              </button>
            </div>

            {/* EVENT CREATION / EXPANSION DRAWER */}
            <AnimatePresence>
              {evtFormOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden"
                >
                  <form onSubmit={handleSaveEvent} className="space-y-6 text-xs font-semibold text-left">
                    <h4 className="font-display font-extrabold text-sm uppercase text-rose-500 border-b border-zinc-850 pb-2">
                      {evtEditingId ? `Edit Event Details: (ID: ${evtEditingId})` : 'Create New Event Entry'}
                    </h4>

                    {/* Quick helper */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Event Title <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={evtTitle}
                          onChange={(e) => setEvtTitle(e.target.value)}
                          placeholder="e.g. Karate Training"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Date Scheduled <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          required
                          value={evtDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEvtDate(val);
                            if (isPastDate(val)) {
                              setEvtStatus('Completed');
                            } else{
                              setEvtStatus('Upcoming');
                            }
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Time range</label>
                        <input
                          type="text"
                          value={evtTime}
                          onChange={(e) => setEvtTime(e.target.value)}
                          placeholder="e.g. 09:00 AM - 04:00 PM"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Event Location</label>
                        <input
                          type="text"
                          value={evtLocation}
                          onChange={(e) => setEvtLocation(e.target.value)}
                          placeholder="e.g. Main Training Hall"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Event Status</label>
                        <select
                          value={evtStatus}
                          onChange={(e) => {
                            const val = e.target.value as 'Upcoming' | 'Completed';
                            if (val === 'Upcoming' && isPastDate(evtDate)) {
                              alert('Past events cannot be marked as Upcoming. Please select Completed status.');
                              setEvtStatus('Completed');
                              return;
                            }
                            if (val === 'Completed' && !isPastDate(evtDate)) {
                              alert('Future events cannot be marked as Completed. Please select Upcoming status.');
                              setEvtStatus('Upcoming');
                              return;
                            }
                            setEvtStatus(val);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none"
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Completed">Completed</option>
                        </select>
                        {isPastDate(evtDate) ? (
                          <span className="text-[10px] text-amber-500 font-normal block mt-1">
                            ⚠️ Past event status must be "Completed".
                          </span>
                        ):(
                          <span className="text-[10px] text-zinc-500 font-normal block mt-1">
                            ℹ️ Future event status must be "Upcoming".
                          </span>
                        )}
                      </div>
                    </div>

                    {/* <div className="space-y-1.5">
                      <label className="text-zinc-300 uppercase tracking-wider block">Short Description Summary <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={evtDescription}
                        onChange={(e) => setEvtDescription(e.target.value)}
                        placeholder="A rapid summary displayed underneath lists cards (1-2 sentences)."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                      />
                    </div> */}

                    <div className="space-y-1.5">
                      <label className="text-zinc-300 uppercase tracking-wider block">Description <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={6}
                        value={evtContent}
                        onChange={(e) => setEvtContent(e.target.value)}
                        placeholder="Add details here. You can start paragraphs with '## Heading' or '### Subhead' for styling."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* DIGITAL ASSETS AND VIDEO MEDIA COMPILER FOR BOTH WEB SOURCES AND LOCAL DISK UPLOADS */}
                    <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-850 space-y-4">
                      <h5 className="font-display uppercase text-xs tracking-wider text-rose-500 flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Interactive Media Settings & File Uploads</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 1. Poster upload */}
                        <div className="space-y-2">
                          <FileUploader
                            label="Upload Poster Image (.jpg/.png)"
                            accept="image/*"
                            onUploadSuccess={(url) => setEvtPosterUrl(url)}
                            token={token}
                          />
                          <input
                            type="text"
                            value={evtPosterUrl}
                            onChange={(e) => setEvtPosterUrl(e.target.value)}
                            placeholder="Poster Image URL"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-2 text-zinc-350 focus:outline-none text-[11px] font-normal"
                          />
                        </div>

                        {/* 2. Video upload */}
                        <div className="space-y-2">
                          <FileUploader
                            label="Upload Promo Video (.mp4)"
                            accept="video/mp4"
                            onUploadSuccess={(url) => setEvtVideoUrl(url)}
                            token={token}
                          />
                          <input
                            type="text"
                            value={evtVideoUrl}
                            onChange={(e) => setEvtVideoUrl(e.target.value)}
                            placeholder="Promotional MP4 Video/URL"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-2 text-zinc-350 focus:outline-none text-[11px] font-normal"
                          />
                        </div>

                        {/* 3. Slider Toggle slider options */}
                        <div className="bg-zinc-955 p-3.5 rounded-lg border border-zinc-800 flex flex-col justify-between">
                          <span className="block text-zinc-300 font-bold uppercase tracking-wider text-[10px] pb-1 border-b border-zinc-850">
                            Slider Configurations
                          </span>
                          <label className="flex items-center space-x-3 text-zinc-300 pt-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={evtAutoScroll}
                              onChange={(e) => setEvtAutoScroll(e.target.checked)}
                              className="h-4.5 w-4.5 text-rose-600 rounded bg-zinc-950 focus:outline-none"
                            />
                            <div>
                              <span className="block font-bold uppercase text-[10px]">Enable Auto Scroll</span>
                              <span className="block text-[9px] text-zinc-500 font-normal">Include in homepage carousel.</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* 4. Multiple Gallery Media list upload */}
                      <div className="space-y-3.5 border-t border-zinc-900 pt-4 text-left">
                        <label className="text-zinc-300 uppercase tracking-widest block font-bold text-[11px]">
                          Gallery Media ({evtGalleryUrls.length} added)
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FileUploader
                            label="Add Gallery Media"
                            accept="image/*,video/*"
                            onUploadSuccess={addGalleryUrlString}
                            token={token}
                            multiple={true}
                          />
                          
                          <div className="sm:col-span-2 bg-zinc-950/80 p-3 h-[140px] overflow-y-auto rounded-lg border border-zinc-800 flex flex-wrap gap-2 content-start select-none">
                            {evtGalleryUrls.length === 0 ? (
                              <p className="text-[11px] text-zinc-500 font-normal self-center m-auto">
                                No gallery media compiled. Use upload button to append.
                              </p>
                            ) : (
                              evtGalleryUrls.map((g, idx) => (
                                <AdminGalleryMediaItem
                                  key={idx}
                                  gUrl={g}
                                  onRemove={() => removeGalleryUrlIdx(idx)}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 justify-end pt-2 border-t border-zinc-850">
                      <button
                        type="button"
                        onClick={resetEventForm}
                        className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-905 text-zinc-450 border border-zinc-800 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer flex items-center space-x-1.5"
                      >
                        <Save className="h-4 w-4" />
                        <span>{evtEditingId ? 'Update Event Record' : 'Publish Event'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LIVE REGISTRY LIST TABLE */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden">
              <div className="p-4 bg-zinc-950 border-b border-zinc-850 text-xs font-bold uppercase tracking-wider text-rose-500">
                Show All Events
              </div>

              {events.length === 0 ? (
                <p className="text-zinc-500 text-xs p-6">No event records in databases.</p>
              ) : (
                <div className="divide-y divide-zinc-850 select-none">
                  {events.map((evt) => (
                    <div key={evt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-900/60 transition gap-4 text-left">
                      <div className="flex items-center space-x-4">
                        <img
                          src={getMediaUrl(evt.posterUrl)}
                          className="w-16 h-12 object-cover rounded border border-zinc-800"
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-extrabold text-white uppercase">{evt.title}</p>
                          <p className="text-xs text-zinc-400 font-mono mt-0.5">{evt.date} / {evt.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3.5 shrink-0 self-end sm:self-center">
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${
                          evt.status === 'Upcoming' ? 'bg-red-950 text-red-400 border border-red-900/50' : 'bg-zinc-950 text-zinc-500 border border-zinc-850'
                        }`}>
                          {evt.status}
                        </span>
                        
                        <button
                          onClick={() => startEditEvent(evt)}
                          className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 rounded transition cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEventClick(evt.id, evt.title)}
                          className="p-2 bg-zinc-950 hover:bg-red-950 text-zinc-450 hover:text-rose-400 border border-zinc-800 rounded transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== C: TRAINERS LIST & FORMS CRUD ==================== */}
        {activeTab === 'trainers' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">Trainers</h3>
              <button
                onClick={() => { if (trnFormOpen) { resetTrainerForm(); } else { setTrnFormOpen(true); } }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center space-x-1.5 cursor-pointer"
              >
                {trnFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{trnFormOpen ? 'Collapse Form' : 'Register New Trainer'}</span>
              </button>
            </div>

            {/* TRAINER FORMS CONTAINER */}
            <AnimatePresence>
              {trnFormOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-zinc-900 border border-zinc-805 rounded-xl p-6 overflow-hidden"
                >
                  <form onSubmit={handleSaveTrainer} className="space-y-6 text-xs font-semibold text-left">
                    <h4 className="font-display font-extrabold text-sm uppercase text-rose-500 border-b border-zinc-850 pb-2">
                      {trnEditingId ? `Edit Instructor Board Profile (ID: ${trnEditingId})` : 'Register New Trainer'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Trainer Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={trnName}
                          onChange={(e) => setTrnName(e.target.value)}
                          placeholder="e.g. Professor Khan Ahmed"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Trainer Specialty</label>
                        <input
                          type="text"
                          value={trnSpecialty}
                          onChange={(e) => setTrnSpecialty(e.target.value)}
                          placeholder="e.g. MMA Trainer"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-300 uppercase tracking-wider">Coaching Experience</label>
                        <input
                          type="text"
                          value={trnExperience}
                          onChange={(e) => setTrnExperience(e.target.value)}
                          placeholder="e.g. 15 Years"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-300 uppercase tracking-wider block">Short Biography <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={trnBio}
                        onChange={(e) => setTrnBio(e.target.value)}
                        placeholder="A rapid motivational quote or belt status summary (1 sentence)."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-white font-normal focus:outline-none focus:border-red-500"
                      />
                    </div>


                    {/* image uploading for staff images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
                      <FileUploader
                        label="Upload Trainer Portrait photograph (.jpg/.png)"
                        accept="image/*"
                        onUploadSuccess={(url) => setTrnImageUrl(url)}
                        token={token}
                      />
                      <div className="space-y-1 text-left self-center">
                        <label className="text-zinc-300 uppercase tracking-wider font-bold block text-[10px]">Or Paste Picture Web Address</label>
                        <input
                          type="text"
                          value={trnImageUrl}
                          onChange={(e) => setTrnImageUrl(e.target.value)}
                          placeholder="Trainer Portrait Image Web Address Video/URL"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-2 text-zinc-350 focus:outline-none text-[10px] font-normal"
                        />
                      </div>
                    </div>

                    {/* Action toggler */}
                    <div className="flex space-x-3 justify-end pt-2 border-t border-zinc-850">
                      <button
                        type="button"
                        onClick={resetTrainerForm}
                        className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-905 text-zinc-450 border border-zinc-800 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer flex items-center space-x-1.5"
                      >
                        <Save className="h-4 w-4" />
                        <span>{trnEditingId ? 'Update Trainer board' : 'Add Trainer Profile'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LIVE TRAINER TABLE */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden">
              <div className="p-4 bg-zinc-950 border-b border-zinc-850 text-xs font-bold uppercase tracking-wider text-rose-500">
                Show All Trainers
              </div>

              {trainers.length === 0 ? (
                <p className="text-zinc-500 text-xs p-6">No trainer staff registered in database.</p>
              ) : (
                <div className="divide-y divide-zinc-850 select-none">
                  {trainers.map((trainer) => (
                    <div key={trainer.id} className="flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-900/60 transition gap-4 text-left">
                      <div className="flex items-center space-x-4">
                        <img
                          src={getMediaUrl(trainer.imageUrl)}
                          className="w-12 h-12 object-cover rounded-full border border-zinc-800"
                          alt=""
                        />
                        <div>
                          <span className="text-xs uppercase font-bold text-rose-500 block leading-tight">{trainer.specialty}</span>
                          <span className="text-sm font-extrabold text-white uppercase block mt-0.5">{trainer.name}</span>
                          <span className="text-[10px] text-zinc-500 font-normal">Active for {trainer.experience}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => startEditTrainer(trainer)}
                          className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 rounded transition cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrainerClick(trainer.id, trainer.name)}
                          className="p-2 bg-zinc-950 hover:bg-red-950 text-zinc-450 hover:text-rose-400 border border-zinc-800 rounded transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== D: WHATSAPP INQUIRIES LOGS ==================== */}
        {activeTab === 'inquiries' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden space-y-4">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-rose-500">
              <span>Dynamic WhatsApp Contact logs</span>
              <button
                onClick={pullInquiries}
                className="text-zinc-400 hover:text-white uppercase"
              >
                Sync refresh
              </button>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-zinc-450 text-xs py-8 text-center">No inquiry logs registered since system startup.</p>
            ) : (
              <div className="divide-y divide-zinc-850 p-4 space-y-3.5 select-none text-left">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 bg-zinc-950/80 hover:bg-zinc-950 border border-zinc-805 rounded-xl space-y-2.5 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-sm font-extrabold text-white uppercase">{inq.name}</span>
                        <span className="px-2 py-0.5 bg-red-650/20 text-rose-500 border border-red-500/20 rounded font-mono text-[9px] font-bold uppercase">{inq.program}</span>
                        <span className="text-[10px] text-zinc-550 font-mono">{new Date(inq.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 text-[11px] font-semibold text-zinc-450">
                        <span>Email: <span className="font-normal text-zinc-300">{inq.email}</span></span>
                        {inq.phone && <span>Phone: <span className="font-normal text-zinc-300">{inq.phone}</span></span>}
                      </div>

                      <p className="text-xs text-zinc-305 font-sans italic leading-relaxed pt-1">
                        "{inq.message}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteInquiryClick(inq.id)}
                      className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-rose-400 border border-zinc-800 rounded self-end md:self-center cursor-pointer"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
