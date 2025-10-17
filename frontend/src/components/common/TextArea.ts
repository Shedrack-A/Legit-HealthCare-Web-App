import styled from 'styled-components';

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.inputPadding};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.5;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.main}33;
  }
`;