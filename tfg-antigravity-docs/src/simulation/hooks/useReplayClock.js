import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight hook to manage the simulation replay clock.
 * 
 * @param {Object} options
 * @param {number} options.startTime - Initial time in seconds
 * @param {number} options.endTime - End time in seconds
 * @param {number} options.playbackRate - Real-time multiplier (default: 1)
 */
export function useReplayClock({ startTime = -1800, endTime = 60, playbackRate = 1 } = {}) {
  const [currentTime, setCurrentTime] = useState(startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  
  const toggle = useCallback(() => {
    setIsPlaying(prev => {
      // If we're at the end and they press play, restart
      if (!prev && currentTime >= endTime) {
        setCurrentTime(startTime);
        return true;
      }
      return !prev;
    });
  }, [currentTime, endTime, startTime]);

  const scrub = useCallback((time) => {
    setCurrentTime(Math.max(startTime, Math.min(time, endTime)));
  }, [startTime, endTime]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const nextTime = prev + playbackRate;
        if (nextTime >= endTime) {
          setIsPlaying(false);
          return endTime;
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, endTime, playbackRate]);

  return {
    currentTime,
    isPlaying,
    play,
    pause,
    toggle,
    scrub,
    progress: (currentTime - startTime) / (endTime - startTime)
  };
}
