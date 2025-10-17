import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  h1 { font-size: ${({ theme }) => theme.fontSizes.xlarge}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.large}; }
  h3 { font-size: 1.1rem; }


  p {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    line-height: 1.5;
  }

  a {
    color: ${({ theme }) => theme.main};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  input, button, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }
`;