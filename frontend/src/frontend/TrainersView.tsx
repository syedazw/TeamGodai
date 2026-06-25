/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TrainerModel } from '../types.ts';
import { getMediaUrl } from '../apiConfig.ts';

interface TrainersViewProps {
  trainers: TrainerModel[];
}

export default function TrainersView({ trainers }: TrainersViewProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerModel | null>(null);

  return (
    <div id="trainers-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      
      {/* 1. VIEW HEADER */}
      <div className="border-b border-zinc-805 pb-5 text-left max-w-2xl">
        {/* <span className="text-xs font-mono tracking-widest uppercase text-rose-500">Board Of Black Belts</span> */}
        <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wider text-white">Team Of Expert Coaches</h1>
        
      </div>

      {/* 2. DYNAMIC ROSTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => (
          <motion.div
            key={trainer.id}
            whileHover={{ y: -6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between h-full"
          >
            {/* Image container */}
            <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
              <img
                src={getMediaUrl(trainer.imageUrl)}
                alt={trainer.name}
                className="w-full h-full object-cover filter grayscale contrast-110 hover:grayscale-0 transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full flex items-center space-x-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[11px] text-zinc-100 font-bold uppercase tracking-wider">Certified</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-6 pt-12">
                <span className="px-2.5 py-1 bg-red-600 text-[10px] font-bold font-mono tracking-widest rounded uppercase text-white inline-block shadow-md">
                  {trainer.specialty}
                </span>
                <h3 className="text-xl font-display font-extrabold uppercase text-white mt-2 break-words">
                  {trainer.name}
                </h3>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs">
                  <Award className="h-4 w-4 text-red-500" />
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold">Years of coaching:</span>
                  <span className="text-white font-bold">{trainer.experience}</span>
                </div>
                
                <p className="text-xs text-zinc-400 italic leading-relaxed break-words">
                  "{trainer.bio}"
                </p>
              </div>

              {/* <div className="pt-2">
                <button
                  id={`btn-trainer-bio-${trainer.id}`}
                  onClick={() => setSelectedTrainer(trainer)}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 font-semibold text-xs text-zinc-300 hover:text-white uppercase tracking-wider transition-all rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>View Trainer </span>
                </button>
              </div> */}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. DEDICATED MASTER MODAL */}
      {/* <AnimatePresence>
        {selectedTrainer && (
          <motion.div
            id="trainer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrainer(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-left"
            >
              {/* Header card info */}
              {/* <div className="relative h-48 bg-zinc-950 overflow-hidden">
                <img
                  src={selectedTrainer.imageUrl}
                  alt={selectedTrainer.name}
                  className="w-full h-full object-cover filter brightness-50"
                />
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full border border-zinc-800 transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-2 py-0.5 bg-rose-600 text-[9px] text-white font-mono rounded tracking-widest uppercase">
                    {selectedTrainer.specialty}
                  </span>
                  <h2 className="text-2xl font-display font-bold uppercase text-white mt-1">
                    {selectedTrainer.name}
                  </h2>
                </div>
              </div> */} 

              {/* Body */}
              {/* <div className="p-6 space-y-5">
                <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-3">
                  <span className="text-zinc-500 uppercase tracking-widest font-mono">Academy Status</span>
                  <span className="text-rose-500 font-bold uppercase tracking-wider bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    Lead Coach ({selectedTrainer.experience})
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono tracking-widest text-rose-500 uppercase font-bold">Biography & Achievements</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                    {selectedTrainer.detailBio}
                  </p>
                </div>

                <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-rose-500" />
                    <span>Background Approved</span>
                  </div>
                  <p>All of our coaches carry verified credentials, physical athletic licensing, and martial arts lineage validations.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}
