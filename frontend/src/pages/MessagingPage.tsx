import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { Send } from 'react-feather';

const MessagingContainer = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  background-color: ${({ theme }) => theme.background};
`;

const ConversationList = styled.div`
  width: 30%;
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.cardBg};
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
  display: flex;
  flex-direction: column;
`;

const MessageInputForm = styled.form`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  background-color: ${({ theme }) => theme.cardBg};
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.main};
  }
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme.main};
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-left: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`;

const ConversationItem = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  cursor: pointer;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.accent : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.cardHover};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.textSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  strong {
    font-size: ${({ theme }) => theme.fontSizes.small};
    display: block;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
  }
`;

const socket = io('http://localhost:5000');

const MessagingPage: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data);
    };
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation) {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `/api/conversations/${activeConversation}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  useEffect(() => {
    if (user && activeConversation) {
      socket.emit('join', { username: user.firstName, room: `conversation_${activeConversation}` });
    }

    socket.on('new_message', (message: any) => {
      if (message.conversation_id === activeConversation) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      if (user && activeConversation) {
        socket.emit('leave', { username: user.firstName, room: `conversation_${activeConversation}` });
      }
      socket.off('new_message');
    };
  }, [user, activeConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const token = localStorage.getItem('token');
    socket.emit('send_message', {
      conversation_id: activeConversation,
      content: newMessage,
      token: token,
    });
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
            <p>{convo.last_message || 'No messages yet'}</p>
          </ConversationItem>
        ))}
      </ConversationList>
      <ChatWindow>
        <MessageArea>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              isSender={msg.sender_id === user?.id}
            >
              <strong>{msg.sender_username}</strong>
              <p>{msg.content}</p>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessageArea>
        <MessageInputForm onSubmit={handleSendMessage}>
          <MessageInput
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!activeConversation}
          />
          <SendButton type="submit" disabled={!activeConversation}>
            <Send size={20} />
          </SendButton>
        </MessageInputForm>
      </ChatWindow>
    </MessagingContainer>
  );
};

export default MessagingPage;
