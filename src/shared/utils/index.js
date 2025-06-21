// 🔧 Shared Utilities for RUN:REBEL Components

// GTM Helper Functions
export const GTMTracker = {
  // Send event to dataLayer
  track(eventName, data = {}) {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...data,
        timestamp: Date.now()
      });
    }
  },

  // Generate unique interaction ID
  generateInteractionId(anonymousId, sessionId) {
    return `${anonymousId}_${sessionId}_${Date.now()}`;
  }
};

// Device Detection
export const DeviceDetector = {
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  getDeviceInfo() {
    return {
      device_type: this.getDeviceType(),
      cpu_cores: navigator.hardwareConcurrency || 0,
      memory_gb: navigator.deviceMemory || 0,
      screen_width: window.screen.width,
      screen_height: window.screen.height
    };
  }
};

// UUID Generation
export const UUIDGenerator = {
  generate() {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

// Storage Helper
export const StorageHelper = {
  get(key, fallback = null) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      try {
        return sessionStorage.getItem(key) || fallback;
      } catch (e2) {
        return fallback;
      }
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch (e2) {
        return false;
      }
    }
  }
};

console.log('🔧 RUN:REBEL utilities loaded');