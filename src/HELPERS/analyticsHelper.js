/**
 * 🔹 Detect Device Info
 */
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;

  // 📱 Platform detection
  const isMobile = /Mobile|Android|iPhone|iPod/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const platform = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  // 🌐 Browser detection
  let browser = 'unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  // 💻 OS detection
  let os = 'unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone')) os = 'iOS';

  return { platform, browser, os };
};

/**
 * 🔹 Calculate Scroll Depth (0-100%)
 */
export const calculateScrollDepth = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  const scrollableDistance = documentHeight - windowHeight;
  const scrollPercentage = (scrollTop / scrollableDistance) * 100;
  
  return Math.min(Math.round(scrollPercentage), 100);
};

/**
 * 🔹 Track Time on Page
 */
export class TimeTracker {
  constructor() {
    this.startTime = Date.now();
    this.totalTime = 0;
    this.isActive = true;
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  pause() {
    if (this.isActive) {
      this.totalTime += Date.now() - this.startTime;
      this.isActive = false;
    }
  }

  resume() {
    if (!this.isActive) {
      this.startTime = Date.now();
      this.isActive = true;
    }
  }

  getTimeSpent() {
    const current = this.isActive ? Date.now() - this.startTime : 0;
    return Math.round((this.totalTime + current) / 1000); // Return in seconds
  }

  reset() {
    this.startTime = Date.now();
    this.totalTime = 0;
    this.isActive = true;
  }
}
