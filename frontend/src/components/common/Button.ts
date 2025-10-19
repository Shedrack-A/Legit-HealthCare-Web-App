import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface ButtonProps {
  variant?: 'danger';
}

export const Button = styled.button<ButtonProps>`
  padding: ${({ theme }) => theme.inputPadding};
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.mainHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }

  ${({ variant, theme }) =>
    variant === 'danger' &&
    css`
      background-color: ${theme.error};
      &:hover {
        background-color: #c82333;
      }
    `}
`;

export const PrimaryButton = styled(Button)`
  // Inherits all styles from Button
`;

export const PrimaryLinkButton = styled(Link)`
  padding: ${({ theme }) => theme.inputPadding};
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  width: 90%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.mainHover};
    text-decoration: none;
  }
`;

export const SecondaryLinkButton = styled(Link)`
  padding: ${({ theme }) => theme.inputPadding};
  background-color: transparent;
  color: ${({ theme }) => theme.main};
  border: 1px solid ${({ theme }) => theme.main};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  width: 90%;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.main};
    color: white;
    text-decoration: none;
  }
`;
