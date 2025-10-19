import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    main: string;
    mainHover: string;
    accent: string;
    disabled: string;
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    borderRadius: string;
    cardPadding: string;
    inputPadding: string;
    mode: string;
    background: string;
    text: string;
    textSecondary: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    error: string;
  }
}
