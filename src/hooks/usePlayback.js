import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to control simulation playback.
 * 
 * @param {Array} steps - List of simulation step objects
 * @param {number} [initialSpeed=1] - Initial playback speed multiplier (0.5x, 1x, 2x, 4x)
 * @returns {Object} Playback state and control handlers
 */
export function usePlayback(steps = [], initialSpeed = 1) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const timerRef = useRef(null);

  const totalSteps = steps.length;
  const isFirst = currentIndex === 0;
  const isLast = totalSteps === 0 || currentIndex >= totalSteps - 1;
  const currentStep = totalSteps > 0 ? steps[Math.min(currentIndex, totalSteps - 1)] : null;

  // Reset index when steps array reference changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Pause playback
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Start playback
  const play = useCallback(() => {
    if (isLast) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  }, [isLast]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Step forward
  const next = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [totalSteps]);

  // Step backward
  const prev = useCallback(() => {
    setCurrentIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return 0;
    });
  }, []);

  // Reset to first step
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  // Jump to specific step
  const jumpTo = useCallback((index) => {
    const target = Math.max(0, Math.min(index, totalSteps - 1));
    setCurrentIndex(target);
  }, [totalSteps]);

  // Auto-play timer effect
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // If already at last step, stop playing
    if (currentIndex >= totalSteps - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalTime = Math.max(200, 1200 / speed);

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, speed, currentIndex, totalSteps]);

  return {
    currentIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    jumpTo,
    setSpeed,
    isFirst,
    isLast,
  };
}
