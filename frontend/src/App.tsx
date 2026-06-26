/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-ignore
import {Route, Routes, Navigate} from 'react-router-dom';
import {useNavigate, useLocation} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, MessageSquare, Twitter, Facebook, Instagram, Mail, Phone, MapPin, Youtube, Linkedin } from 'lucide-react';

import { EventModel, TrainerModel } from './types.ts';
import { getApiUrl } from './apiConfig.ts';
// @ts-ignore
import teamGodaiLogo from './assets/images/logo.png';
import Navbar from './frontend/Navbar.tsx';
import HomeView from './frontend/HomeView.tsx';
import EventsView from './frontend/EventsView.tsx';
import EventDetailView from './frontend/EventDetailView.tsx';
import TrainersView from './frontend/TrainersView.tsx';
import AboutView from './frontend/AboutView.tsx';
import ContactView from './frontend/ContactView.tsx';
import AdminView from './admin/AdminView.tsx';
import ScrollToTop from './scrollToTopButton';



export default function App() {

  const location= useLocation();

  // Separate Admin layout based on URL route
  const isAdminPortal = location.pathname === '/admin-portal' || location.pathname.startsWith('/admin');


  const [events, setEvents] = useState<EventModel[]>([]);
  const [trainers, setTrainers] = useState<TrainerModel[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Load admin token from local Storage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('valor_admin_token');
    if (savedToken) {
      // Dry verification
      fetch(getApiUrl('/api/admin/verify'), {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setAdminToken(savedToken);
          } else {
            localStorage.removeItem('valor_admin_token');
          }
        })
        .catch(() => { });
    }
  }, []);

  // Fetch initial Events & Trainers from database
  const loadEventsData = async () => {
    try {
      const r = await fetch(getApiUrl('/api/events'));
      if (r.ok) {
        const list = await r.json();
        setEvents(list);
      }
    } catch (e) {
      console.error('Failed fetching events', e);
    }
  };

  const loadTrainersData = async () => {
    try {
      const r = await fetch(getApiUrl('/api/trainers'));
      if (r.ok) {
        const list = await r.json();
        setTrainers(list);
      }
    } catch (e) {
      console.error('Failed fetching trainers', e);
    }
  };

  useEffect(() => {
    loadEventsData();
    loadTrainersData();
  }, []);

  // Admin login trigger
  const handleAdminLogin = async (username: string, pwd: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pwd })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        localStorage.setItem('valor_admin_token', data.token);
        return true;
      }
    } catch (e) {
      console.error('Login action error', e);
    }
    return false;
  };

  // Admin logout trigger
  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('valor_admin_token');
    // For separation, send them back to the frontend homepage on sign out
    window.location.href = '/admin-portal';
  };

  // ==================== REST CRUD OPERATIONS ====================

  // Create Event
  const handleCreateEvent = async (eventData: Partial<EventModel>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(getApiUrl('/api/events'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        await loadEventsData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Update Event
  const handleUpdateEvent = async (id: string, eventData: Partial<EventModel>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(getApiUrl(`/api/events/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        await loadEventsData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Delete Event
  const handleDeleteEvent = async (id: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(getApiUrl(`/api/events/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await loadEventsData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Create Trainer
  const handleCreateTrainer = async (trainerData: Partial<TrainerModel>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(getApiUrl('/api/trainers'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(trainerData)
      });
      if (res.ok) {
        await loadTrainersData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Update Trainer
  const handleUpdateTrainer = async (id: string, trainerData: Partial<TrainerModel>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(getApiUrl(`/api/trainers/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(trainerData)
      });
      if (res.ok) {
        await loadTrainersData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Delete Trainer
  const handleDeleteTrainer = async (id: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(getApiUrl(`/api/trainers/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await loadTrainersData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Submit Inquiry (logs to database file)
  const handleAddInquiry = async (inquiryData: { name: string; email: string; phone: string; program: string; message: string }): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      return res.ok;
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Helper Switcher triggers
  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`)
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };


  // Render separated secure Admin Portal if user is on explicit admin URL
  if (isAdminPortal) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-rose-600 selection:text-white">
        {/* Isolated Command Center */}
        <main className="flex-grow">
          <AdminView
            events={events}
            trainers={trainers}
            token={adminToken}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onCreateTrainer={handleCreateTrainer}
            onUpdateTrainer={handleUpdateTrainer}
            onDeleteTrainer={handleDeleteTrainer}
          />
        </main>
        {/* <footer className="bg-zinc-950 border-t border-zinc-900 py-6 text-center text-[10px] font-mono uppercase tracking-wider text-zinc-650">
          <p>&copy; 2026 Team Godai Pakistan Command Portal &bull; Secure Administrative Area Only</p>
        </footer> */}
      </div>
    );
  }

  return (
    
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-red-600 selection:text-white">

      <div id='top-sentinel'></div>

      {/* 1. APP NAVBAR HEADER */}
      <Navbar
        onViewChange={handleNavigate}
      />

      {/* 2. MAIN WORKSPACE CONTAINER (WITH TRANSLATION ANIMATIONS) */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={ <HomeView events={events} trainers={trainers} onViewChange={handleNavigate} onEventClick={handleEventClick}/>} />
            <Route path="/events" element={ <EventsView events={events} onEventClick={handleEventClick}/>} />
            <Route path="/events/:id" element={ <EventDetailView events={events} />} />
            <Route path="/trainers" element={ <TrainersView trainers={trainers} />} />
            <Route path="/contact" element={ <ContactView onAddInquiry={handleAddInquiry}/>} />
            <Route path="/about" element={ <AboutView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* 3. APP FOOTER COMPONENT */}
      <footer className="bg-zinc-950 border-t border-zinc-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Branding panel */}
            <div className=" flex flex-col item-center px-20 space-y-4 ">
              <div className="flex items-center space-x-3">
                <div className="w-35 h-35 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={teamGodaiLogo}
                    alt="Team Godai Pakistan Logo"
                    className=" w-full h-full object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-zinc-500 hover:text-white transition">
                <a href="https://www.instagram.com/teamgodaipakistan2000/" className="p-2 bg-zinc-90 w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition cursor-pointer">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://www.youtube.com/@TeamGodaiPakistan" className="p-2 bg-zinc-90 w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition cursor-pointer">
                  <Youtube className="h-4 w-4" />
                </a>

                <a href="https://twitter.com/TeamGodaiPak" className="p-2 bg-zinc-90 w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition cursor-pointer">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://www.facebook.com/teamgodaipakistan" className="p-2 bg-zinc-90 w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition cursor-pointer">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://www.linkedin.com/in/team-godai-pakistan-36555a2a0/" className="p-2 bg-zinc-90 w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition cursor-pointer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>


            {/* Support links */}
            <div className="items-center text-center space-y-3 text-xs uppercase tracking-wider font-bold mt-6">
              <h4 className="text-zinc-500 text-xs font-mono tracking-widest ">OPENING HOURS</h4>
              <ul className="space-y-2 font-semibold text-zinc-400">
                <li>
                  <p>Monday – Wednesday – Friday</p>
                </li>
                <li>
                  <span>08:00 PM – 09:00 PM</span>
                </li>
                <li>
                  <p>Tuesday – Thursday – Saturday</p>
                </li>
                <li>
                  <span>08:00 PM – 10:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Contacts quick stats */}
            <div className="flex flex-col items-center text-center gap-5 text-xs text-zinc-400 mt-6">
              <h4 className="text-zinc-500 font-mono tracking-widest uppercase font-bold">CONTACT INFO</h4>
              <div className="flex flex-col items-center justify-center space-y-2 font-sans font-medium">
                <p className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>House#B21  Row  D  Block  4, Gulshan-e-Kaniz  Fatima  Scheme  33, Karachi, Pakistan</span>
                </p>

                <p className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>+92 300 2901998</span>
                </p>

                <p className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>martialarts@teamgodaipakistan.com</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-center text-xs text-zinc-500">
            <p className='text-center'>&copy; 2026 Team Godai Pakistan Martial Arts & Sports Academy. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <ScrollToTop />

    </div>
  );
}
