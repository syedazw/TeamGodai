/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Calendar, Users, Info, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {useLocation} from 'react-router-dom';
// @ts-ignore
import teamGodaiLogo from '../assets/images/logo.png';

interface NavbarProps {
  onViewChange: (path: string) => void;
}

export default function Navbar({ onViewChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation()


  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/trainers', label: 'Trainers', icon: Users },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact & Schedule', icon: Phone },
  ];

  const handleNavClick = (path: string) => {
    onViewChange(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-18">
        <div className="flex items-center justify-between min-h-[100px]">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 min-w-0 cursor-pointer" onClick={() => handleNavClick('/')} id="nav-brand">
            <div className="w-25 h-25 md:w-15 md:h-15 rounded-full overflow-hidden shrink-0 ">
              <img 
                src={teamGodaiLogo} 
                alt="Team Godai Pakistan Logo" 
                className="w-full h-full object-contain p-2" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-xs md:text-sm tracking-wider text-white block uppercase leading-tight gap-5">
                TEAM GODAI
              </span>
              <span className="text-sm md:text-[20px] font-mono text-rose-500 tracking-widest block uppercase font-bold">
                PAKISTAN
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/'? location.pathname === '/': location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  id={`nav-item-${item.label}`}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Empty right area helper to maintain balance */}
          <div className="hidden md:block w-20"></div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-800 bg-zinc-950"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/'? location.pathname === '/': location.pathname.startsWith(item.path);
                return (
                  <button
                    key={item.path}
                    id={`mobile-nav-${item.label}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium text-left transition ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
