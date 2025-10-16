import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 0.5rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  text-align: center;
  font-size: 0.9rem;

  & p {
    margin: 0;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>&copy; {new Date().getFullYear()} Legit HealthCare Services Ltd. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
