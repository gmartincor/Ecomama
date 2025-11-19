'use client';

import { useEffect } from 'react';

export const useEngagement = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interactions = ['click', 'scroll', 'touchstart', 'keydown'];
    let engagementTracked = false;

    const trackEngagement = () => {
      if (engagementTracked) return;
      
      engagementTracked = true;
      sessionStorage.setItem('pwa-engagement', 'true');
      
      interactions.forEach(event => {
        document.removeEventListener(event, trackEngagement);
      });
    };

    interactions.forEach(event => {
      document.addEventListener(event, trackEngagement, { once: true });
    });

    return () => {
      interactions.forEach(event => {
        document.removeEventListener(event, trackEngagement);
      });
    };
  }, []);
};
