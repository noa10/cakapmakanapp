// Client-side environment variables
// This file will be loaded in index.html before the main application loads
// Allows environment variables to be accessed through window.env
(function(window) {
  window.env = window.env || {};
  
  // Client-side version of environment variables
  // SECURITY WARNING: Do not hardcode API keys here!
  // This file is publicly accessible. Use server-side environment variables instead.
  window.env.VITE_REQUESTY_API_KEY = ""; // API key should be injected at build time or runtime
})(window); 