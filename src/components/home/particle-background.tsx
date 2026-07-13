"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  glow: string;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const maxParticles = window.innerWidth < 768 ? 40 : 80;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function createParticle(): Particle {
      const isBlue = Math.random() < 0.5;
      let color: string, glow: string;

      if (isBlue) {
        // Deep blue tones
        const hue = 200 + Math.random() * 40;
        const sat = 40 + Math.random() * 30;
        const lit = 35 + Math.random() * 25;
        const alpha = Math.random() * 0.35 + 0.05;
        color = `hsla(${hue}, ${sat}%, ${lit}%, ${alpha})`;
        glow = `hsla(${hue}, ${sat}%, ${lit + 10}%, ${alpha * 0.6})`;
      } else {
        // Gray / white tones
        const lit = 50 + Math.random() * 40;
        const alpha = Math.random() * 0.25 + 0.03;
        color = `hsla(0, 0%, ${lit}%, ${alpha})`;
        glow = `hsla(0, 0%, ${lit + 10}%, ${alpha * 0.4})`;
      }

      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.8 + 0.4),
        size: Math.random() * 3 + 1,
        opacity: 1,
        color,
        glow,
      };
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Add new particles if needed
      while (particles.length < maxParticles) {
        particles.push(createParticle());
      }

      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10 || p.x < -10 || p.x > canvas!.width + 10) {
          return false;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;

        // Add glow
        ctx!.shadowColor = p.glow;
        ctx!.shadowBlur = p.size * 4;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        return true;
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      aria-hidden="true"
    />
  );
}
