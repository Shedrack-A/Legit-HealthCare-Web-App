const shared = {
  main: '#056ded',
  mainHover: '#0059b3',
  accent: '#4cc4ff',
  disabled: '#a0a0a0',
  danger: '#dc3545',

  // Spacing and Sizing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  fontSizes: {
    xs: '0.75rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
  },
  borderRadius: '6px',
  cardPadding: '1rem',
  inputPadding: '0.5rem 0.8rem',
};

export const lightTheme = {
  ...shared,
  mode: 'light',
  background: '#f4f7fc',
  text: '#1c1c1e',
  textSecondary: '#6c757d',
  textMuted: '#adb5bd',
  cardBg: '#ffffff',
  cardBorder: '#e0e0e0',
  cardHover: '#f5f5f5',
  error: '#dc3545',
};

export const darkTheme = {
  ...shared,
  mode: 'dark',
  background: '#1a1a1a',
  text: '#e1e1e1',
  textSecondary: '#adb5bd',
  textMuted: '#6c757d',
  cardBg: '#252525',
  cardBorder: '#383838',
  cardHover: '#303030',
  error: '#e4606d',
};
