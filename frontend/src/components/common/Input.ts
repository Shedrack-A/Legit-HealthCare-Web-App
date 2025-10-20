import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.inputPadding};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.medium};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.main}33;
  }
`;
