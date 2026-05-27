import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DUMMY_CONVERSATIONS } from '../utils/dummyData';
import { ChatConversation, ChatMessage } from '../types';

interface ChatContextType {
  conversations: ChatConversation[];
  setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
  sendMessage: (conversationId: string, message: ChatMessage) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(DUMMY_CONVERSATIONS);

  const sendMessage = (conversationId: string, message: ChatMessage) => {
    setConversations(prev =>
      prev.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            messages: [...convo.messages, message],
            lastMessage: message,
          };
        }
        return convo;
      })
    );
  };

  return (
    <ChatContext.Provider value={{ conversations, setConversations, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
