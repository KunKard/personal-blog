"use client";

import { useEffect, useRef, useCallback } from "react";

interface CursorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<CursorParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const hueRef = useRef(0);
  const frameRef = useRef(0);

  const spawnTrailParticle = useCallback(
    (x: number, y: number, dx: number, dy: number) => {
      const hue = hueRef.current;
      hueRef.current = (hue + 3) % 360;

      // Emit opposite to movement direction + random spread
      const speed = Math.sqrt(dx * dx + dy * dy);
      const baseAngle = Math.atan2(dy, dx) + Math.PI; // opposite direction
      const spread = (Math.random() - 0.5) * Math.PI * 0.8;
      const angle = baseAngle + spread;
      const vel = speed * (0.3 + Math.random() * 0.6);

      return {
        x,
        y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        life: 1.0,
        maxLife: 0.3 + Math.random() * 0.5,
        size: 1 + Math.random() * 2,
        hue,
      };
    },
    []
  );

  const spawnBurstParticle = useCallback((x: number, y: number) => {
    const hue = hueRef.current + Math.random() * 60;
    hueRef.current = (hueRef.current + 5) % 360;

    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 6;

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      maxLife: 0.3 + Math.random() * 0.9,
      size: 2 + Math.random() * 5,
      hue,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let lastMoveTime = 0;

    function onMouseMove(e: MouseEvent) {
      const now = performance.now();
      const dt = Math.min(now - lastMoveTime, 50); // cap to avoid jumps after tab switch
      lastMoveTime = now;

      const m = mouseRef.current;
      m.prevX = m.x;
      m.prevY = m.y;
      m.x = e.clientX;
      m.y = e.clientY;

      // Compute movement delta
      const dx = m.x - m.prevX;
      const dy = m.y - m.prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0.5 && dt > 0) {
        // Emit trail particles along the path (subtle: fewer particles)
        const count = Math.min(Math.floor(dist / 8), 2);
        for (let i = 0; i < count; i++) {
          const t = i / Math.max(count, 1);
          const px = m.prevX + dx * t;
          const py = m.prevY + dy * t;
          particlesRef.current.push(spawnTrailParticle(px, py, dx, dy));
        }
      }

      // Cap particles
      while (particlesRef.current.length > 80) {
        particlesRef.current.shift();
      }
    }

    function onClick(e: MouseEvent) {
      const count = 6 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(spawnBurstParticle(e.clientX, e.clientY));
      }
      while (particlesRef.current.length > 100) {
        particlesRef.current.shift();
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    function animate() {
      frameRef.current = requestAnimationFrame(animate);

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const dt = 1 / 60; // ~60fps step
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life -= dt / p.maxLife;

        if (p.life <= 0) {
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }

        // Move with friction only (no gravity)
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Draw (subtle: reduced opacity & glow)
        const alpha = p.life * 0.45;
        const currentSize = p.size * (0.3 + p.life * 0.7);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 60%, 50%, ${alpha})`;

        // Glow — barely visible
        ctx!.shadowColor = `hsla(${p.hue}, 60%, 50%, ${alpha * 0.2})`;
        ctx!.shadowBlur = currentSize * 2;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, [spawnTrailParticle, spawnBurstParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden="true"
    />
  );
}
