// Constants for the portfolio application

export const COLORS = {
  primary: {
    black: '#000000',
    white: '#ffffff',
  },
  accent: {
    blue: '#0066ff',
    emerald: '#10b981',
    purple: '#8b5cf6',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const SKILLS_CATEGORIES = {
  PROGRAMMING: 'programming',
  FRAMEWORKS: 'frameworks',
  DATABASES: 'databases',
  TOOLS: 'tools',
  AI_ML: 'ai_ml',
  SOFT_SKILLS: 'soft_skills',
};

export const EXPERIENCE_TYPES = {
  WORK: 'work',
  EDUCATION: 'education',
  PROJECT: 'project',
  CERTIFICATION: 'certification',
};

export const PROJECT_TYPES = {
  WEB_APP: 'web_app',
  MOBILE_APP: 'mobile_app',
  AI_ML: 'ai_ml',
  DATA_SCIENCE: 'data_science',
  API: 'api',
  OTHER: 'other',
};

export const CONTACT_TYPES = {
  EMAIL: 'email',
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
  PORTFOLIO: 'portfolio',
  PHONE: 'phone',
};

export const API_ENDPOINTS = {
  CHATBOT: '/api/chatbot',
  CONTACT: '/api/contact',
  ANALYTICS: '/api/analytics',
  AUTH: '/api/auth',
  ADMIN: '/api/admin',
};

export const STORAGE_KEYS = {
  LANGUAGE: 'portfolio_language',
  THEME: 'portfolio_theme',
  VISITED: 'portfolio_visited',
  VOICE_PLAYED: 'voice_greeting_played',
};

export const SAMPLE_DATA = {
  skills: [
    { id: 1, name: 'Python', category: SKILLS_CATEGORIES.PROGRAMMING, level: 90 },
    { id: 2, name: 'React', category: SKILLS_CATEGORIES.FRAMEWORKS, level: 85 },
    { id: 3, name: 'Machine Learning', category: SKILLS_CATEGORIES.AI_ML, level: 80 },
    { id: 4, name: 'Node.js', category: SKILLS_CATEGORIES.FRAMEWORKS, level: 75 },
    { id: 5, name: 'PostgreSQL', category: SKILLS_CATEGORIES.DATABASES, level: 70 },
    { id: 6, name: 'TensorFlow', category: SKILLS_CATEGORIES.AI_ML, level: 75 },
  ],
  experiences: [
    {
      id: 1,
      title: 'Data Scientist',
      company: 'Tech Company',
      type: EXPERIENCE_TYPES.WORK,
      startDate: '2023-01-01',
      endDate: null,
      description: 'Leading data science projects and ML model development.',
    },
  ],
  projects: [
    {
      id: 1,
      title: 'AI Portfolio Website',
      type: PROJECT_TYPES.WEB_APP,
      description: 'Interactive 3D portfolio with AI chatbot integration.',
      technologies: ['React', 'Three.js', 'Python', 'AI'],
      liveUrl: '#',
      githubUrl: '#',
    },
  ],
};