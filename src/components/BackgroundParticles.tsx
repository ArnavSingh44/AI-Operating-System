import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let angle = 0; // Global rotation angle
    const maxParticles = 65;
    const connectionDistance = 110;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, // Slow speed
          vy: (Math.random() - 0.35) * 0.35,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Increment global rotation angle
      angle += 0.00015;

      // Pre-compute rotated coordinates for all particles
      const rotatedCoords = particles.map((p, idx) => {
        // Move particle by velocity first
        p.x += p.vx;
        p.y += p.vy;

        // Bounce bounds
        if (p.x < 0 || p.x > w) p.vx = -p.vx;
        if (p.y < 0 || p.y > h) p.vy = -p.vy;

        // Mouse attraction interaction
        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            p.x += dx * 0.004;
            p.y += dy * 0.004;
          }
        }

        // Project with polar rotation around center
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const particleAngle = Math.atan2(dy, dx) + angle;

        return {
          rx: cx + Math.cos(particleAngle) * dist,
          ry: cy + Math.sin(particleAngle) * dist,
          radius: p.radius,
          colorIndex: idx,
        };
      });

      // Draw active particles & connection lines
      rotatedCoords.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.rx, p.ry, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorIndex % 2 === 0 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.3)';
        ctx.fill();

        // Connect nearby nodes
        for (let j = idx + 1; j < rotatedCoords.length; j++) {
          const p2 = rotatedCoords[j];
          const dx = p.rx - p2.rx;
          const dy = p.ry - p2.ry;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.rx, p.ry);
            ctx.lineTo(p2.rx, p2.ry);
            ctx.strokeStyle = p.colorIndex % 3 === 0 
              ? `rgba(0, 240, 255, ${alpha})` 
              : `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
