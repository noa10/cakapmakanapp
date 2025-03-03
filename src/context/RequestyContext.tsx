import React, { createContext, useContext, useState, useCallback } from 'react';

interface RequestyContextType {
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  resetConversation: () => void;
}

const RequestyContext = createContext<RequestyContextType | undefined>(undefined);

export const RequestyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const resetConversation = useCallback(() => {
    setConversationId(null);
  }, []);

  return (
    <RequestyContext.Provider
      value={{
        conversationId,
        setConversationId,
        resetConversation,
      }}
    >
      {children}
    </RequestyContext.Provider>
  );
};

export const useRequesty = () => {
  const context = useContext(RequestyContext);
  if (context === undefined) {
    throw new Error('useRequesty must be used within a RequestyProvider');
  }
  return context;
}; 