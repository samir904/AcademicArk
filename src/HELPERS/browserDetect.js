export const detectBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  
  // More accurate detection
  const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
  const isBrave = ua.includes('brave');
  
  return {
    isSafari,
    isBrave,
    isProblematicBrowser: isSafari || isBrave,
    browserName: isSafari ? 'Safari' : isBrave ? 'Brave' : null
  };
};
