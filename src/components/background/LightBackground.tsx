'use client';

import React from 'react';
import { ParticleCanvas } from './ParticleCanvas';

export const LightBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#f8fafc]">
      {/* Soft Ambient Base Gradient */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(224, 231, 255, 0.5) 0%, rgba(248, 250, 252, 0) 70%)'
        }}
      />

      {/* Floating Blurred Gradient Blob 1 - Soft Pastel Sky */}
      <div
        className="anim-blob-1 absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[90px] opacity-[0.25]"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.8) 0%, rgba(191, 219, 254, 0.2) 70%, transparent 100%)',
        }}
      />

      {/* Floating Blurred Gradient Blob 2 - Soft Lavender / Violet */}
      <div
        className="anim-blob-2 absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[100px] opacity-[0.22]"
        style={{
          background: 'radial-gradient(circle, rgba(196, 181, 253, 0.8) 0%, rgba(221, 214, 254, 0.2) 70%, transparent 100%)',
        }}
      />

      {/* Floating Blurred Gradient Blob 3 - Warm Peach / Amber Tint */}
      <div
        className="anim-blob-3 absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[85px] opacity-[0.16]"
        style={{
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.7) 0%, rgba(253, 230, 138, 0.2) 70%, transparent 100%)',
        }}
      />

      {/* Subtle Ambient Particle Layer */}
      <ParticleCanvas />
    </div>
  );
};
