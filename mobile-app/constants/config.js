// API Configuration
export const API_CONFIG = {
  // Update this to your local IP address when testing on physical device
  // Get your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
  BASE_URL: 'http://localhost:5000/api',

  // If running on physical device, use your computer's IP:
  // BASE_URL: 'http://192.168.1.100:5000/api',

  TIMEOUT: 30000,
};

// Gemini API (if using direct integration)
export const GEMINI_CONFIG = {
  API_KEY: '', // Optional: for direct Gemini integration
};

export default { API_CONFIG, GEMINI_CONFIG };
