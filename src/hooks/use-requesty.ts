import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToRequesty, RequestyResponse } from '@/integrations/requesty';

export function useRequesty() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    message: string,
    language: string = 'english',
    userId?: string
  ): Promise<RequestyResponse> => {
    setIsLoading(true);
    
    try {
      const response = await sendMessageToRequesty(message, language, userId);
      return response;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to get response: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
}