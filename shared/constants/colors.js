// Agribank Digital Guard - Color Palette
// Pastel gradient theme

export const COLORS = {
  // Primary Gradient Colors
  primary: {
    pink: '#FBD6E3',
    cyan: '#A9EDE9',
  },

  // Gradient definitions
  gradients: {
    main: 'linear-gradient(135deg, #FBD6E3 0%, #A9EDE9 100%)',
    reverse: 'linear-gradient(135deg, #A9EDE9 0%, #FBD6E3 100%)',
    vertical: 'linear-gradient(180deg, #FBD6E3 0%, #A9EDE9 100%)',
    horizontal: 'linear-gradient(90deg, #FBD6E3 0%, #A9EDE9 100%)',
  },

  // Semantic colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    light: '#BDC3C7',
  },

  // Status colors
  status: {
    safe: '#27AE60',
    warning: '#F39C12',
    danger: '#E74C3C',
  },

  // Chat colors
  chat: {
    userBubble: '#FBD6E3',
    botBubble: '#A9EDE9',
    userText: '#2C3E50',
    botText: '#2C3E50',
  },

  // UI Elements
  border: '#E8E8E8',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export default COLORS;
