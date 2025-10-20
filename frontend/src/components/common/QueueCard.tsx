import React from 'react';
import styled from 'styled-components';
import { Users } from 'react-feather';

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 250px;
`;

const IconWrapper = styled.div`
  background-color: ${({ theme }) => theme.accent + '22'};
  color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
`;

const Count = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 600;
`;

interface QueueCardProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
}

const QueueCard: React.FC<QueueCardProps> = ({ title, count, icon }) => {
  return (
    <CardContainer>
      <IconWrapper>{icon || <Users size={24} />}</IconWrapper>
      <CardContent>
        <Title>{title}</Title>
        <Count>{count}</Count>
      </CardContent>
    </CardContainer>
  );
};

export default QueueCard;
