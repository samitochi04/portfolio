import { useEffect, useRef } from 'react';
import { useSupabaseAdmin } from './useSupabaseAdmin';

// =============================================
// SAMUEL FOTSO PORTFOLIO - VISITOR TRACKING HOOK
// =============================================

export const useVisitorTracking = () => {
  const { createData } = useSupabaseAdmin();
  const hasTracked = useRef(false);

  // Get basic visitor information
  const getVisitorInfo = () => {
    const info = {
      user_agent: navigator.userAgent,
      language: navigator.language,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || null,
      page_url: window.location.href,
      page_title: document.title
    };

    // Try to get additional browser info
    try {
      info.platform = navigator.platform;
      info.cookie_enabled = navigator.cookieEnabled;
      info.online = navigator.onLine;
    } catch (error) {
      // Could not get extended browser info
    }

    return info;
  };

  // Get approximate location based on timezone (privacy-friendly)
  const getApproximateLocation = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Map common timezones to approximate regions
    const timezoneRegions = {
      'Europe/Paris': 'France',
      'Europe/London': 'United Kingdom',
      'Europe/Berlin': 'Germany',
      'America/New_York': 'United States (East)',
      'America/Los_Angeles': 'United States (West)',
      'America/Chicago': 'United States (Central)',
      'Asia/Tokyo': 'Japan',
      'Asia/Shanghai': 'China',
      'Australia/Sydney': 'Australia'
    };

    return timezoneRegions[timezone] || timezone.split('/')[0] || 'Unknown';
  };

  // Track page view
  const trackPageView = async () => {
    if (hasTracked.current) return;

    try {
      const visitorInfo = getVisitorInfo();
      const sessionId = getSessionId();
      
      const trackingData = {
        session_id: sessionId,
        ip_address: null, // This will be filled by server or left null
        user_agent: visitorInfo.user_agent,
        country: getApproximateLocation(),
        city: null, // We don't have city detection, leave null
        page_visited: visitorInfo.page_url,
        referrer: visitorInfo.referrer,
        // timestamp is automatically set by database
        duration_seconds: 0, // Initial visit, no duration yet
        actions: JSON.stringify([{
          type: 'page_view',
          timestamp: new Date().toISOString(),
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          screen: `${window.screen.width}x${window.screen.height}`,
          device_type: getDeviceType(),
          browser: getBrowserName(visitorInfo.user_agent),
          os: getOSName(visitorInfo.user_agent),
          language: visitorInfo.language,
          timezone: visitorInfo.timezone,
          is_mobile: /Mobile|Android|iPhone|iPad/.test(visitorInfo.user_agent),
          is_bot: /bot|crawler|spider|crawling/i.test(visitorInfo.user_agent)
        }])
      };

      await createData('user_tracking', trackingData);
      hasTracked.current = true;
      
      // Visitor tracked successfully
    } catch (error) {
      // Error tracking visitor
    }
  };

  // Track custom events
  const trackEvent = async (eventType, eventData = {}) => {
    try {
      const sessionId = getSessionId();
      
      const eventTrackingData = {
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData,
        page_url: window.location.href,
        timestamp: new Date().toISOString()
      };

      // For now, we'll log events. In a real app, you might want a separate events table
      // Event tracked successfully
      
      // You could extend this to save to a separate events table
      // await createData('user_events', eventTrackingData);
    } catch (error) {
      // Error tracking event
    }
  };

  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('visitor_session_id');
    
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('visitor_session_id', sessionId);
    }
    
    return sessionId;
  };

  // Generate unique session ID
  const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Detect device type
  const getDeviceType = () => {
    const ua = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  // Extract browser name from user agent
  const getBrowserName = (userAgent) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  };

  // Extract OS name from user agent
  const getOSName = (userAgent) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  // Track page view on mount
  useEffect(() => {
    // Small delay to ensure the page is fully loaded
    const timer = setTimeout(trackPageView, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackEvent('page_focus');
      } else {
        trackEvent('page_blur');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track scroll events (throttled)
  useEffect(() => {
    let scrollTimeout;
    let maxScroll = 0;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          trackEvent('scroll_depth', { max_scroll_percent: maxScroll });
        }, 2000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return {
    trackEvent,
    getSessionId
  };
};