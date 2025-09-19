import { useState, useEffect } from 'react';
import { throttle } from '../lib/utils';

export const useMouse = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let timeoutId;

    const updateMousePosition = throttle((e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Set mouse as not moving after 100ms of no movement
      timeoutId = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    }, 16); // ~60fps

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearTimeout(timeoutId);
    };
  }, []);

  return { mousePosition, isMoving };
};