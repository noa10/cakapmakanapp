import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RequestyResponse, sendMessageToRequesty } from '@/integrations/requesty';

type RequestyContextType = {
  sendMessage: (message: string, language?: string, userId?: string) => Promise<RequestyResponse>;
  isLoading: boolean;
  error: string | null;
};

const RequestyContext = createContext<RequestyContextType | undefined>(undefined);

export const RequestyProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async (
    message: string,
    language: string = 'english',
    userId?: string
  ): Promise<RequestyResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`RequestyContext: Sending message to Requesty.ai (language: ${language})`);
      const response = await sendMessageToRequesty(message, language, userId);
      console.log('RequestyContext: Received response:', response);
      return response;
    } catch (error: any) {
      console.error('RequestyContext: Error sending message:', error);
      const errorMessage = error.message || 'Failed to connect to Requesty.ai';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Return a fallback response
      return {
        message: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
        source: "Error Handler"
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RequestyContext.Provider value={{ sendMessage, isLoading, error }}>
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