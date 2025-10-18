import React, { createContext, useState, useContext, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

type FlashMessageVariant = 'success' | 'error' | 'info';

interface FlashMessage {
  id: number;
  message: string;
  variant: FlashMessageVariant;
}

interface AppContextType {
  showFlashMessage: (message: string, variant?: FlashMessageVariant) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const FlashMessageContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const FlashMessageCard = styled.div<{ variant: FlashMessageVariant }>`
  min-width: 250px;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: white;
  background-color: ${({ theme, variant }) => {
    if (variant === 'success') return '#28a745';
    if (variant === 'error') return '#dc3545';
    return theme.main;
  }};
  animation: ${slideIn} 0.5s ease-out forwards;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const spinner = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #fff;
  border-top-color: ${({ theme }) => theme.main};
  border-radius: 50%;
  animation: ${spinner} 0.6s linear infinite;
`;

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [flashMessages, setFlashMessages] = useState<FlashMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showFlashMessage = (
    message: string,
    variant: FlashMessageVariant = 'info'
  ) => {
    const id = Date.now();
    setFlashMessages((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 5000);
  };

  return (
    <AppContext.Provider value={{ showFlashMessage, isLoading, setIsLoading }}>
      {children}
      <FlashMessageContainer>
        {flashMessages.map(({ id, message, variant }) => (
          <FlashMessageCard key={id} variant={variant}>
            {message}
          </FlashMessageCard>
        ))}
      </FlashMessageContainer>
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
