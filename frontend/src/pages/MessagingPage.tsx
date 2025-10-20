import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const MessagingContainer = styled.div`
  display: flex;
  height: calc(100vh - 120px); // Adjust based on header/footer height
`;

const ConversationList = styled.div`
  width: 30%;
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  overflow-y: auto;
`;

const ChatWindow = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const MessageInputForm = styled.form`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const ConversationItem = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  cursor: pointer;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.accent : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};

  &:hover {
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const MessageBubble = styled.div<{ isSender: boolean }>`
  background-color: ${({ isSender, theme }) =>
    isSender ? theme.main : theme.cardBg};
  color: ${({ isSender, theme }) => (isSender ? 'white' : theme.text)};
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  max-width: 70%;
  align-self: ${({ isSender }) => (isSender ? 'flex-end' : 'flex-start')};
`;

const MessagingPage: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(
    null
  );
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch conversations on load
  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      // A simple way to get the user ID from the token for the demo
      const decodedToken: any = JSON.parse(atob(token?.split('.')[1] || '{}'));
      setCurrentUserId(decodedToken.user_id);

      const response = await axios.get('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data);
    };
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `/api/conversations/${activeConversation}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      };
      fetchMessages();
    }
  }, [activeConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const token = localStorage.getItem('token');
    await axios.post(
      '/api/messages',
      {
        conversation_id: activeConversation,
        content: newMessage,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Refresh messages
    const response = await axios.get(
      `/api/conversations/${activeConversation}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMessages(response.data);
    setNewMessage('');
  };

  return (
    <MessagingContainer>
      <ConversationList>
        {conversations.map((convo) => (
          <ConversationItem
            key={convo.id}
            isActive={convo.id === activeConversation}
            onClick={() => setActiveConversation(convo.id)}
          >
            <strong>{convo.name}</strong>
            <p>{convo.last_message}</p>
          </ConversationItem>
        ))}
      </ConversationList>
      <ChatWindow>
        <MessageArea>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              isSender={msg.sender_id === currentUserId}
            >
              <strong>{msg.sender_username}</strong>
              <p>{msg.content}</p>
            </MessageBubble>
          ))}
        </MessageArea>
        <MessageInputForm onSubmit={handleSendMessage}>
          <MessageInput
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </MessageInputForm>
      </ChatWindow>
    </MessagingContainer>
  );
};

export default MessagingPage;
