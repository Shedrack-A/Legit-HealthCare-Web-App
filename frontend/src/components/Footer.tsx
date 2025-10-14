import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  text-align: center;
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>&copy; {new Date().getFullYear()} Legit HealthCare Services Ltd. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
