import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Custom hook to calculate mouse parallax tilt vectors.
 * Returns spring-animated values for rotateX and rotateY.
 * 
 * @param intensity Max tilt angle in degrees. Default is 10.
 */
export const useParallax = (intensity = 10) => {
  // Normalized mouse coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring configuration for premium 60fps animations
  const springConfig = { damping: 30, stiffness: 120, mass: 1 };
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      
      // Calculate cursor position relative to screen center
      const normX = (event.clientX / innerWidth) - 0.5;
      const normY = (event.clientY / innerHeight) - 0.5;
      
      x.set(normX);
      y.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return { rotateX, rotateY };
};
