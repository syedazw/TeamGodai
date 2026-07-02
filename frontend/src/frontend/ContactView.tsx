/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle,  CheckCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { ClassSchedule } from '../types.ts';
import { getApiUrl } from '../apiConfig.ts';

interface ContactViewProps {
  onAddInquiry: (inquiryData: { name: string; email: string; phone: string; program: string; message: string }) => Promise<boolean>;
}

export default function ContactView({ onAddInquiry }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // const [schedules, setSchedules] = useState<ClassSchedule[]>([]);

  // Fetch schedules from backend
  // useEffect(() => {
  //   fetch(getApiUrl('/api/schedule'))
  //     .then(r => {
  //       if (r.ok) return r.json();
  //       throw new Error('Schedules not available');
  //     })
  //     .then(data => setSchedules(data))
  //     .catch(e => console.error(e));
  // }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please complete all compulsory fields (Name, Email, Message).');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Submit to REST API backend database log
      const isLogged = await onAddInquiry({ name, email, phone, program, message });

      // 2. Format custom WhatsApp redirect text link
      const textMessage = ` ${message}`;
      const encodedText = encodeURIComponent(textMessage);
      // Real WhatsApp API redirection link (using dummy academy contact phone: e.g. 123456789 or custom settings)
      const whatsAppLink = `https://wa.me/923002901998?text=${encodedText}`;

      // Open in new tab referrer-safe
      window.open(whatsAppLink, '_blank');

      setSubmitted(true);
      // Clear forms
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 text-left">
      
      {/* 1. HEADER */}
      <div className="border-b border-zinc-805 pb-5 text-left max-w-2xl">
        <span className="text-xs font-mono tracking-widest uppercase text-rose-500">Contact & Scheduling</span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wider text-white">Get On The Mats</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Have questions about fees, uniform standards, or kids karate classes? Give us a shout or review our weekly classes schedules below.
        </p>
      </div>


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
                ].map((row, idx) => (
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


      {/* 3. COL: TWO PANELS (Contact info (Col 5) vs Form (Col 7)) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact info list (Col 5) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6">
            <h3 className="font-display font-extrabold text-lg uppercase tracking-wider text-rose-500 border-b border-zinc-800 pb-3">
              TEAM GODAI PAKISTAN Coordinates
            </h3>
            
            <div className="space-y-4 font-sans text-sm">
              <div className="flex items-start space-x-3.5">
                <MapPin className="h-5 w-5 text-zinc-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-100">Address</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">House#B21 Row D Block 4, Gulshan-e-Kaniz Fatima Scheme 33, Karachi, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Phone className="h-5 w-5 text-zinc-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-100">Hotline & WhatsApp Support</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">+92 300 2901998</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Mail className="h-5 w-5 text-zinc-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-100">Official email</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">martialarts@teamgodaipakistan.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h4 className="font-display font-bold uppercase text-xs tracking-wider text-rose-500 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Classes Hours</span>
            </h4>
            <div className="space-y-1.5 text-xs font-semibold text-zinc-300">
              <div className="flex justify-between">
                <span>Weekdays (Mon - Fri):</span>
                <span className="font-mono text-white">06:00 AM - 09:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday Sessions:</span>
                <span className="font-mono text-white">08:00 AM - 04:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday Open Mat:</span>
                <span className="font-mono text-rose-500">CLOSED (Private Seminars)</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Dynamic Contact form (Col 7) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg uppercase text-white tracking-widest flex items-center space-x-2.5">
              <MessageCircle className="h-5 w-5 text-red-500" />
              <span>Inquire & Message Us</span>
            </h3>
            {/* <p className="text-zinc-400 text-xs">
              Submitting logs your details directly into our administrative calendar database and will route you to WhatsApp for direct chat response.
            </p> */}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
            {submitted && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-xl flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inquiry Logged & Transmitted!</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">We logged your consultation request in our database. If WhatsApp did not open, contact this number directly +92 300 2901998.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase tracking-wider block">Your Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-red-500 transition font-normal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase tracking-wider block">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. fighter@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-red-500 transition font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase tracking-wider block">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 333 540192"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-red-500 transition font-normal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase tracking-wider block">Preferred Training Program</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-red-500 transition font-normal"
                >
                  <option value="Grind">Grind</option>
                  <option value="Fit Station">Fit Station</option>
                  {/* <option value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu (BJJ)</option>
                  <option value="Combat Fitness">Cardio & Physical Conditioning</option>
                  <option value="Kids Karate/BJJ">Youth Academy Programs</option> */}
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-zinc-300 uppercase tracking-wider block">Your Inquiry Messages <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help ?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-red-500 transition font-normal text-xs"
              />
            </div>

            <button
              id="btn-contact-submit"
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-red-600/10 hover:scale-[1.01]"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Transmitting...' : 'Send WhatsApp & Log Inquire'}</span>
            </button>
            
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-sans justify-center pt-1.5 select-none">
              <Info className="h-3 w-3" />
              <span>Redirects securely to standard WhatsApp API. No credentials stored.</span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
