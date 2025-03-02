import { useToast } from "@/hooks/use-toast";

// The type for the response from Requesty.ai
export type RequestyResponse = {
  message: string;
  source?: string;
};

// Get API key with fallback for development
const getApiKey = (): string => {
  // Try to get from import.meta.env first (Vite's approach)
  const viteKey = import.meta.env?.VITE_REQUESTY_API_KEY;
  if (viteKey) return viteKey;
  
  // Fallback to window.env if available (sometimes used as a runtime fallback)
  // @ts-ignore
  const windowEnv = typeof window !== 'undefined' && window.env?.VITE_REQUESTY_API_KEY;
  if (windowEnv) return windowEnv;
  
  // Hardcoded fallback for development only
  // In production, this should never be used
  if (import.meta.env.DEV) {
    console.warn('Using hardcoded API key fallback - not recommended for production');
    // Use the API key we've confirmed working in tests
    return "sk-hRDsD6wARtyxAngfhNdxg/oLV8DzNM8zX/FKNXHv7qnuw1irdqGo1WOzdLDdDZ7ahqyRI4Qw6fH/34F+XVSjEPMBMJq1ckl6XYIP5Rv9ZQg=";
  }
  
  return '';
};

// The main function to send a message to Requesty.ai
export async function sendMessageToRequesty(
  message: string, 
  language: string = 'english',
  userId?: string
): Promise<RequestyResponse> {
  try {
    // Use proxy URL instead of direct API endpoint
    const url = "/requesty-api/v1/chat/completions";
    
    // Use environment variable for API key
    const apiKey = getApiKey();
    
    console.log("API Key available:", !!apiKey, "First 10 chars:", apiKey.substring(0, 10) + "...");
    console.log("Sending to URL:", url);
    console.log("Browser environment:", {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      language: navigator.language
    });
    
    if (!apiKey) {
      throw new Error("Requesty.ai API key is not configured");
    }
    
    console.log("Sending request to Requesty.ai with language:", language);
    
    // Format request according to OpenAI-compatible API
    const requestBody = {
      model: "openai/gpt-4o", // We've confirmed this model works
      messages: [
        {
          role: "system",
          content: `You are a friendly food ordering assistant. You help users order food from restaurants. ${
            language === 'malay' ? 'Please respond in Malay language.' : 'Please respond in English.'
          }`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };
    
    console.log("Request body:", JSON.stringify(requestBody));
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // First, try a network connectivity test
      try {
        const testResponse = await fetch('https://httpbin.org/get', { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout for test request
        });
        console.log("Network connectivity test:", testResponse.ok ? "PASSED" : "FAILED", testResponse.status);
      } catch (testError) {
        console.warn("Network connectivity test failed:", testError);
        // Continue with the actual request anyway
      }
      
      // First try with standard approach
      try {
        console.log("Attempting standard fetch request...");
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "Accept": "application/json",
            "Origin": window.location.origin,
            "Cache-Control": "no-cache"
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
          credentials: 'omit',
          referrerPolicy: 'no-referrer'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Standard fetch request succeeded:", data);
          
          // Extract the response from the OpenAI-compatible format
          const responseMessage = data.choices?.[0]?.message?.content || 
            "Sorry, I couldn't process your request at this time.";
          
          return {
            message: responseMessage,
            source: data.source || "Requesty.ai"
          };
        } else {
          console.warn("Standard fetch failed, status:", response.status);
          // Let it fall through to try alternative approaches
        }
      } catch (standardFetchError) {
        console.warn("Standard fetch approach failed:", standardFetchError);
        // Continue to alternative approaches
      }
      
      // If we got here, all approaches failed
      throw new Error("All connection approaches to Requesty.ai failed");
      
    } catch (fetchError: any) {
      console.error("Fetch error details:", {
        name: fetchError.name,
        message: fetchError.message,
        type: typeof fetchError,
        cause: fetchError.cause,
        stack: fetchError.stack
      });
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error("Error calling Requesty.ai:", error);
    throw error;
  }
}

// Hook to use Requesty features
export function useRequesty() {
  const { toast } = useToast();
  
  const sendMessage = async (message: string, language: string, userId?: string) => {
    try {
      return await sendMessageToRequesty(message, language, userId);
    } catch (error: any) {
      console.error("Error in useRequesty hook:", error);
      toast({
        title: "Requesty.ai Error",
        description: error.message || "Failed to connect to Requesty.ai. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    sendMessage,
  };
}