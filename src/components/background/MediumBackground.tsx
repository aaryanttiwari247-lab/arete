'use client';

import React from 'react';
import { ParticleCanvas } from './ParticleCanvas';

export const MediumBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#1e293b]">
      {/* Ambient Slate Horizon Gradient */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 1) 100%)',
        }}
      />

      {/* Floating Slate-Cyan Ambient Gradient Blob */}
      <div
        className="anim-blob-1 absolute -top-[5%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[110px] opacity-[0.16]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, rgba(14, 165, 233, 0.15) 60%, transparent 100%)',
        }}
      />

      {/* Floating Twilight Indigo Ambient Glow */}
      <div
        className="anim-blob-2 absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[120px] opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.6) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 100%)',
        }}
      />

      {/* Deep Soft Teal Glow at Bottom */}
      <div
        className="anim-blob-3 absolute -bottom-[15%] left-[25%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.5) 0%, rgba(20, 184, 166, 0.1) 60%, transparent 100%)',
        }}
      />

      {/* Subtle Ambient Particle Drift */}
      <ParticleCanvas />
    </div>
  );
};
