import styled from 'styled-components';
import { Link } from 'react-router-dom';

const baseButtonStyles = `
  display: inline-block;
  width: 90%;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  text-align: center;
  border: 1px solid transparent;
`;

export const PrimaryButton = styled.button`
  ${baseButtonStyles}
  background-color: ${({ theme }) => theme.main};
  color: white;
  border-color: ${({ theme }) => theme.main};

  &:hover {
    background-color: ${({ theme }) => theme.mainHover};
  }
`;

export const SecondaryButton = styled.button`
  ${baseButtonStyles}
  background-color: #A9A9A9;
  color: white;
  border-color: #a9a9a9;

  &:hover {
    background-color: #8c8c8c;
  }
`;

export const PrimaryLinkButton = styled(Link)`
  ${baseButtonStyles}
  background-color: ${({ theme }) => theme.main};
  color: white;
  border-color: ${({ theme }) => theme.main};

  &:hover {
    background-color: ${({ theme }) => theme.mainHover};
  }
`;

export const SecondaryLinkButton = styled(Link)`
  ${baseButtonStyles}
  background-color: #A9A9A9;
  color: white;
  border-color: #a9a9a9;

  &:hover {
    background-color: #8c8c8c;
  }
`;
