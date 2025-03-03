import { useRequesty } from '@/context/RequestyContext';

export interface RequestyResponse {
  message: string;
  source?: string;
}

export const sendMessageToRequesty = async (
  message: string, 
  language: 'english' | 'malay' = 'english',
  userId: string = 'anonymous'
): Promise<RequestyResponse> => {
  try {
    const response = await fetch('/requesty-api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Requesty API');
    }

    const data = await response.json();
    
    return {
      message: data.message || 'No response from Requesty API',
      source: data.source || 'Requesty AI',
    };
  } catch (error) {
    console.error('Error sending message to Requesty:', error);
    throw error;
  }
};

export const useRequestyAgent = () => {
  const { conversationId, setConversationId } = useRequesty();

  const sendMessage = async (message: string, language: 'english' | 'malay' = 'english'): Promise<RequestyResponse | null> => {
    try {
      const response = await fetch('/requesty-api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      return {
        message: data.message,
        source: data.source,
      };
    } catch (error) {
      console.error('Error sending message to Requesty:', error);
      return null;
    }
  };

  return {
    sendMessage,
    conversationId,
  };
}; 