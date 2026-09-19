'use client';

import React from 'react';
import { ParticleCanvas } from './ParticleCanvas';

export const DarkBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#090d16]">
      {/* Deep Space Radial Base */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(19, 26, 42, 0.9) 0%, rgba(9, 13, 22, 1) 80%)',
        }}
      />

      {/* Subtle Geometric Engineering Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Slow Moving Cosmic Blue Blob */}
      <div
        className="anim-blob-1 absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-[0.14]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.5) 0%, rgba(37, 99, 235, 0.1) 60%, transparent 100%)',
        }}
      />

      {/* Deep Violet Glow */}
      <div
        className="anim-blob-2 absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[140px] opacity-[0.13]"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.1) 60%, transparent 100%)',
        }}
      />

      {/* Muted Deep Teal Horizon Glow */}
      <div
        className="anim-blob-3 absolute -bottom-[15%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, rgba(15, 118, 110, 0.1) 60%, transparent 100%)',
        }}
      />

      {/* Subtle Star / Dust Drift */}
      <ParticleCanvas />
    </div>
  );
};
