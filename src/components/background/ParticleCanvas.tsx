'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SmallHourglass {
  id: number;
  gridCol: number;
  gridRow: number;
  baseX: number;
  baseY: number;
  H: number; // half-height (e.g. 24px - 38px, total height 48px - 76px)
  cycleDuration: number;
  timeOffset: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  phaseX: number;
  phaseY: number;
}

interface FloatingTimeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  lifespan: number;
  age: number;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, backgroundAnimation, reduceMotion, intensity } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let hourglasses: SmallHourglass[] = [];
    const timeFliesParticles: FloatingTimeParticle[] = [];

    const generateHourglasses = (w: number, h: number) => {
      const isMobile = w < 640;
      const isTablet = w >= 640 && w < 1024;

      // Adjust grid columns and rows based on screen width
      const cols = isMobile ? 3 : isTablet ? 4 : Math.min(7, Math.max(4, Math.floor(w / 220)));
      const rows = isMobile ? 4 : isTablet ? 4 : Math.min(5, Math.max(3, Math.floor(h / 230)));

      const cellW = w / cols;
      const cellH = h / rows;

      const list: SmallHourglass[] = [];
      let id = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Add organic offset from center of grid cell
          const jitterX = (Math.random() - 0.5) * (cellW * 0.45);
          const jitterY = (Math.random() - 0.5) * (cellH * 0.45);
          const baseX = c * cellW + cellW / 2 + jitterX;
          const baseY = r * cellH + cellH / 2 + jitterY;

          // Scale: half-height between 22px and 36px (mobile slightly smaller: 18px to 28px)
          const minH = isMobile ? 18 : 24;
          const maxH = isMobile ? 28 : 36;
          const H = minH + Math.random() * (maxH - minH);

          // Cycle duration modulated by intensity
          const baseCycle = intensity === 'low' ? 38 : intensity === 'high' ? 18 : 26;
          const cycleDuration = baseCycle * (0.8 + Math.random() * 0.4);
          const timeOffset = Math.random() * cycleDuration;

          list.push({
            id: id++,
            gridCol: c,
            gridRow: r,
            baseX,
            baseY,
            H,
            cycleDuration,
            timeOffset,
            driftSpeedX: 0.3 + Math.random() * 0.4,
            driftSpeedY: 0.25 + Math.random() * 0.35,
            driftAmpX: 4 + Math.random() * 8,
            driftAmpY: 4 + Math.random() * 8,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
          });
        }
      }
      return list;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      hourglasses = generateHourglasses(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let lastTimestamp = performance.now();
    const flipDuration = 2.0; // seconds for smooth 180 flip
    const maxTimeFlies = intensity === 'low' ? 30 : intensity === 'high' ? 70 : 45;

    const render = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Theme-specific color palettes
      let sandColorStart: string;
      let sandColorEnd: string;
      let glassStroke: string;
      let glassHighlight: string;
      let glassTint: string;
      let glowColor: string;

      if (theme === 'light') {
        sandColorStart = 'rgba(245, 158, 11, 0.85)'; // warm amber gold
        sandColorEnd = 'rgba(217, 119, 6, 0.9)';
        glassStroke = 'rgba(100, 116, 139, 0.28)';
        glassHighlight = 'rgba(255, 255, 255, 0.7)';
        glassTint = 'rgba(255, 255, 255, 0.16)';
        glowColor = 'rgba(251, 191, 36, 0.15)';
      } else if (theme === 'medium') {
        sandColorStart = 'rgba(56, 189, 248, 0.85)'; // luminous cyan
        sandColorEnd = 'rgba(251, 191, 36, 0.85)';  // twilight amber
        glassStroke = 'rgba(148, 163, 184, 0.3)';
        glassHighlight = 'rgba(186, 230, 253, 0.6)';
        glassTint = 'rgba(255, 255, 255, 0.04)';
        glowColor = 'rgba(56, 189, 248, 0.16)';
      } else {
        // Dark theme
        sandColorStart = 'rgba(251, 191, 36, 0.9)';  // stardust gold
        sandColorEnd = 'rgba(129, 140, 248, 0.85)'; // cosmic violet
        glassStroke = 'rgba(148, 163, 184, 0.22)';
        glassHighlight = 'rgba(224, 231, 255, 0.55)';
        glassTint = 'rgba(255, 255, 255, 0.03)';
        glowColor = 'rgba(129, 140, 248, 0.16)';
      }

      // Render each small hourglass
      for (let i = 0; i < hourglasses.length; i++) {
        const hg = hourglasses[i];
        const effectiveSandTime = hg.cycleDuration - flipDuration;

        // Current time in cycle for this specific hourglass (staggered phases)
        const timeInCycle = reduceMotion || !backgroundAnimation
          ? hg.timeOffset % effectiveSandTime
          : (timestamp * 0.001 + hg.timeOffset) % hg.cycleDuration;

        let rotation = 0;
        let isFlipping = false;
        let progress = 0;

        if (timeInCycle < effectiveSandTime) {
          progress = timeInCycle / effectiveSandTime;
          rotation = 0;
        } else {
          // In 180 flip phase
          isFlipping = true;
          const flipT = (timeInCycle - effectiveSandTime) / flipDuration;
          const ease = 0.5 - 0.5 * Math.cos(Math.PI * flipT);
          rotation = ease * Math.PI;
          progress = 1 - ease;
        }

        if (reduceMotion) {
          rotation = 0;
          progress = 0.5;
          isFlipping = false;
        }

        // Calculate position with gentle floating drift
        const tSec = timestamp * 0.001;
        const driftX = reduceMotion || !backgroundAnimation
          ? 0
          : Math.sin(tSec * hg.driftSpeedX + hg.phaseX) * hg.driftAmpX;
        const driftY = reduceMotion || !backgroundAnimation
          ? 0
          : Math.cos(tSec * hg.driftSpeedY + hg.phaseY) * hg.driftAmpY;

        const currX = hg.baseX + driftX;
        const currY = hg.baseY + driftY;

        const H = hg.H;
        const W = H * 0.52;
        const neckW = Math.max(3, H * 0.1);
        const neckH = Math.max(4, H * 0.14);
        const halfNeckW = neckW / 2;
        const halfNeckH = neckH / 2;
        const topY = -H;
        const botY = H;

        // Soft ambient aura behind each small hourglass
        const auraGrad = ctx.createRadialGradient(currX, currY, 4, currX, currY, H * 1.3);
        auraGrad.addColorStop(0, glowColor);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(currX, currY, H * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(currX, currY);
        ctx.rotate(rotation);

        // Trace glass path
        const trace = () => {
          ctx.beginPath();
          ctx.moveTo(-W, topY);
          ctx.lineTo(W, topY);
          ctx.bezierCurveTo(W * 0.85, topY * 0.45, halfNeckW * 2.2, -halfNeckH * 1.8, halfNeckW, -halfNeckH);
          ctx.lineTo(halfNeckW, halfNeckH);
          ctx.bezierCurveTo(halfNeckW * 2.2, halfNeckH * 1.8, W * 0.85, botY * 0.45, W, botY);
          ctx.lineTo(-W, botY);
          ctx.bezierCurveTo(-W * 0.85, botY * 0.45, -halfNeckW * 2.2, halfNeckH * 1.8, -halfNeckW, halfNeckH);
          ctx.lineTo(-halfNeckW, -halfNeckH);
          ctx.bezierCurveTo(-halfNeckW * 2.2, -halfNeckH * 1.8, -W * 0.85, topY * 0.45, -W, topY);
          ctx.closePath();
        };

        // Glass interior fill
        trace();
        ctx.fillStyle = glassTint;
        ctx.fill();

        // Top Bulb Sand (draining reservoir)
        ctx.save();
        ctx.beginPath();
        ctx.rect(-W * 1.5, topY - 6, W * 3, H + 6);
        trace();
        ctx.clip();

        const topSandRemainRatio = Math.max(0, 1 - progress);
        if (topSandRemainRatio > 0.02) {
          const sandSurfaceY = topY + (H - halfNeckH) * (1 - topSandRemainRatio * 0.88);
          const funnelDipY = Math.min(-halfNeckH - 1, sandSurfaceY + (isFlipping ? 0 : 6));

          const sandGrad = ctx.createLinearGradient(0, topY, 0, -halfNeckH);
          sandGrad.addColorStop(0, sandColorStart);
          sandGrad.addColorStop(1, sandColorEnd);
          ctx.fillStyle = sandGrad;

          ctx.beginPath();
          ctx.moveTo(-W * 1.2, sandSurfaceY);
          ctx.quadraticCurveTo(0, funnelDipY, W * 1.2, sandSurfaceY);
          ctx.lineTo(W * 1.2, 0);
          ctx.lineTo(-W * 1.2, 0);
          ctx.closePath();
          ctx.fill();

          // Surface highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-W * 0.7 * topSandRemainRatio, sandSurfaceY);
          ctx.quadraticCurveTo(0, funnelDipY, W * 0.7 * topSandRemainRatio, sandSurfaceY);
          ctx.stroke();
        }
        ctx.restore();

        // Bottom Bulb Sand (accumulating mound)
        ctx.save();
        ctx.beginPath();
        ctx.rect(-W * 1.5, 0, W * 3, H + 6);
        trace();
        ctx.clip();

        const botSandRatio = Math.min(1, progress);
        if (botSandRatio > 0.02) {
          const peakHeight = (H - halfNeckH) * 0.78 * botSandRatio;
          const pilePeakY = botY - peakHeight;
          const pileSpreadX = Math.min(W * 0.95, W * (0.32 + botSandRatio * 0.64));

          const botSandGrad = ctx.createLinearGradient(0, pilePeakY, 0, botY);
          botSandGrad.addColorStop(0, sandColorStart);
          botSandGrad.addColorStop(1, sandColorEnd);
          ctx.fillStyle = botSandGrad;

          ctx.beginPath();
          ctx.moveTo(-pileSpreadX, botY);
          const ripple = isFlipping ? 0 : Math.sin(timestamp * 0.01 + hg.id) * 0.8;
          ctx.quadraticCurveTo(0, pilePeakY + ripple, pileSpreadX, botY);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-pileSpreadX * 0.65, botY);
          ctx.quadraticCurveTo(0, pilePeakY + ripple, pileSpreadX * 0.65, botY);
          ctx.stroke();
        }
        ctx.restore();

        // Falling sand stream through the neck
        if (!isFlipping && topSandRemainRatio > 0.02 && backgroundAnimation) {
          const streamEndY = botY - (H - halfNeckH) * 0.78 * botSandRatio;

          const streamGrad = ctx.createLinearGradient(0, -halfNeckH, 0, streamEndY);
          streamGrad.addColorStop(0, sandColorStart);
          streamGrad.addColorStop(1, sandColorEnd);

          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(0, -halfNeckH);
          ctx.lineTo(0, streamEndY);
          ctx.stroke();

          // Occasional time flies particle spawn from this hourglass
          if (timeFliesParticles.length < maxTimeFlies && Math.random() < 0.04) {
            timeFliesParticles.push({
              x: currX + (Math.random() - 0.5) * 8,
              y: currY + streamEndY,
              vx: (Math.random() - 0.5) * 16,
              vy: -(Math.random() * 20 + 12),
              size: Math.random() * 1.6 + 0.6,
              alpha: 0,
              maxAlpha: Math.random() * 0.5 + 0.2,
              lifespan: Math.random() * 3.5 + 2.0,
              age: 0,
            });
          }
        }

        // Glass outline
        trace();
        ctx.strokeStyle = glassStroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Specular highlight on left curve
        ctx.beginPath();
        ctx.moveTo(-W * 0.88, topY + 6);
        ctx.bezierCurveTo(-W * 0.75, topY * 0.45, -halfNeckW * 1.8, -halfNeckH * 1.6, -halfNeckW * 0.8, -halfNeckH);
        ctx.strokeStyle = glassHighlight;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-halfNeckW * 0.8, halfNeckH);
        ctx.bezierCurveTo(-halfNeckW * 1.8, halfNeckH * 1.6, -W * 0.75, botY * 0.45, -W * 0.88, botY - 6);
        ctx.strokeStyle = glassHighlight;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Top & Bottom Caps
        const capW = W * 1.14;
        const capH = 4;
        ctx.fillStyle = glassStroke;
        ctx.beginPath();
        ctx.roundRect(-capW / 2, topY - capH, capW, capH, 2);
        ctx.roundRect(-capW / 2, botY, capW, capH, 2);
        ctx.fill();

        ctx.restore();
      }

      // Render "Time Flies" floating stardust across the whole screen
      if (backgroundAnimation && !reduceMotion) {
        // Ambient random spawns across screen
        if (timeFliesParticles.length < maxTimeFlies && Math.random() < 0.12) {
          timeFliesParticles.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.9 + height * 0.1,
            vx: (Math.random() - 0.5) * 14,
            vy: -(Math.random() * 22 + 10),
            size: Math.random() * 1.8 + 0.7,
            alpha: 0,
            maxAlpha: Math.random() * 0.45 + 0.2,
            lifespan: Math.random() * 4.5 + 2.5,
            age: 0,
          });
        }

        for (let i = timeFliesParticles.length - 1; i >= 0; i--) {
          const p = timeFliesParticles[i];
          p.age += dt;

          if (p.age >= p.lifespan) {
            timeFliesParticles.splice(i, 1);
            continue;
          }

          p.x += (p.vx + Math.sin(p.age * 2 + p.size) * 6) * dt;
          p.y += p.vy * dt;

          const lifeProgress = p.age / p.lifespan;
          if (lifeProgress < 0.25) {
            p.alpha = (lifeProgress / 0.25) * p.maxAlpha;
          } else {
            p.alpha = (1 - (lifeProgress - 0.25) / 0.75) * p.maxAlpha;
          }

          let pColor: string;
          if (theme === 'light') {
            pColor = `rgba(217, 119, 6, ${p.alpha})`;
          } else if (theme === 'medium') {
            pColor = `rgba(56, 189, 248, ${p.alpha})`;
          } else {
            pColor = `rgba(251, 191, 36, ${p.alpha})`;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = pColor;
          ctx.fill();

          if (p.size > 1.5 && p.alpha > 0.25) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
            ctx.lineWidth = 0.6;
            const arm = p.size * 1.6;
            ctx.beginPath();
            ctx.moveTo(p.x - arm, p.y);
            ctx.lineTo(p.x + arm, p.y);
            ctx.moveTo(p.x, p.y - arm);
            ctx.lineTo(p.x, p.y + arm);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, backgroundAnimation, reduceMotion, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        opacity: backgroundAnimation ? 0.85 : 0.4,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
};

export const SandClockCanvas = ParticleCanvas;


