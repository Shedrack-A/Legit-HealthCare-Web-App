import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'react-feather';

const AccordionContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.cardBg};
`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const AccordionTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const AccordionButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.main};
  font-weight: 600;
  cursor: pointer;
`;

const AccordionContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionContainer>
      <AccordionHeader onClick={() => setIsOpen(!isOpen)}>
        <AccordionTitle>{title}</AccordionTitle>
        <AccordionButton>
          {isOpen ? (
            <>
              <ChevronUp size={20} />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              Expand
            </>
          )}
        </AccordionButton>
      </AccordionHeader>
      {isOpen && <AccordionContent>{children}</AccordionContent>}
    </AccordionContainer>
  );
};

export default Accordion;
