import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import VerticalTimeline from './VerticalTimeline';
import { timelineEvents } from '../data/timelineData';
import '../css/timeline-sync.css';

export default function StickyTimeline() {
  const [activeEventId, setActiveEventId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const playTimeoutRef = useRef(null);

  // Suggested durations in ms
  const playDurations = {
    t1: 2000, t2: 1500, t3: 2500, t4: 3000, t5: 4000, 
    t6: 4000, t7: 3000, t8: 4000, t9: 2000, t10: 1000
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  // Cancel playback on manual scroll
  useEffect(() => {
    if (!isPlaying) return;
    
    const handleUserScroll = () => stopPlayback();
    
    window.addEventListener('wheel', handleUserScroll, { once: true, passive: true });
    window.addEventListener('touchmove', handleUserScroll, { once: true, passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
    };
  }, [isPlaying]);

  // Setup Intersection Observer with robust element detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isPlaying) {
          let bestEntry = null;
          entries.forEach((entry) => {
            if (entry.isIntersecting && (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)) {
              bestEntry = entry;
            }
          });
          if (bestEntry) {
            setActiveEventId(bestEntry.target.id);
          }
        }
      },
      {
        rootMargin: "-10% 0px -30% 0px",
        threshold: [0, 0.1, 0.5, 0.9, 1]
      }
    );

    let attempts = 0;
    const maxAttempts = 10;
    const intervalId = setInterval(() => {
      const firstElement = document.getElementById(timelineEvents[0].id);
      if (firstElement) {
        // Elements exist, observe them
        clearInterval(intervalId);
        timelineEvents.forEach((ev) => {
          const el = document.getElementById(ev.id);
          if (el) observer.observe(el);
        });
        
        // Initialize first event if nothing is active
        setActiveEventId(prev => prev || timelineEvents[0].id);
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
      attempts++;
    }, 100);

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, [isPlaying]);

  const scrollToEvent = (id, smooth = true) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
  };

  const handleEventClick = (id) => {
    if (isPlaying) stopPlayback();
    setActiveEventId(id);
    scrollToEvent(id, true);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    let currentIndex = 0;
    
    const playNext = () => {
      if (currentIndex >= timelineEvents.length) {
        stopPlayback();
        return;
      }
      
      const event = timelineEvents[currentIndex];
      setActiveEventId(event.id);
      scrollToEvent(event.id, false); // Instant scroll during playback
      
      const duration = playDurations[event.id] || 2000;
      
      currentIndex++;
      playTimeoutRef.current = setTimeout(playNext, duration);
    };
    
    playNext();
  };

  return (
    <>
      <button 
        className="timeline-mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? 'Ocultar cronología' : 'Mostrar cronología'}
      </button>
      
      <div className={`timeline-sync-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <button 
          className={`timeline-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={isPlaying ? stopPlayback : startPlayback}
        >
          {isPlaying ? '⏹ Detener reproducción' : '▶ Reproducir colapso'}
        </button>
        
        <VerticalTimeline 
          activeEventId={activeEventId} 
          onEventClick={handleEventClick} 
        />
      </div>
    </>
  );
}
