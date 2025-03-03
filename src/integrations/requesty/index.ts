
import { useToast } from "@/hooks/use-toast";

// The type for the response from Requesty.ai
export type RequestyResponse = {
  message: string;
  source?: string;
};

// LLM Provider Configuration
export interface LLMProviderConfig {
  id: string;
  name: string;
  provider: 'openai' | 'ollama' | 'grok';
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
}

// Get active LLM provider configuration
export const getActiveLLMConfig = (): LLMProviderConfig | null => {
  // Try to get from localStorage
  const storedConfig = localStorage.getItem('activeLLMConfig');
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (e) {
      console.error('Failed to parse stored LLM config', e);
    }
  }
  
  // Default config if none is found
  return {
    id: 'default-openai',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '', // Will fall back to env variable or development key
    model: 'gpt-4o',
    isActive: true
  };
};

// Get API key with fallback for development
const getApiKey = (): string => {
  // First check if we have an active LLM config with an API key
  const activeConfig = getActiveLLMConfig();
  if (activeConfig?.apiKey) return activeConfig.apiKey;
  
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

// Get the base URL for the API request
const getBaseUrl = (): string => {
  // Check if we have an active LLM config with a base URL
  const activeConfig = getActiveLLMConfig();
  if (activeConfig?.baseUrl) {
    // If it's not OpenAI, use the actual baseUrl
    if (activeConfig.provider !== 'openai') {
      return activeConfig.baseUrl;
    }
  }
  
  // Default to proxy URL for OpenAI-compatible endpoints
  return "/requesty-api/v1/chat/completions";
};

// Get the model to use for the request
const getModel = (): string => {
  const activeConfig = getActiveLLMConfig();
  return activeConfig?.model || "openai/gpt-4o";
};

// The main function to send a message to Requesty.ai
export async function sendMessageToRequesty(
  message: string, 
  language: string = 'english',
  userId?: string
): Promise<RequestyResponse> {
  try {
    // Get configuration
    const activeConfig = getActiveLLMConfig();
    const url = getBaseUrl();
    const apiKey = getApiKey();
    const model = getModel();
    
    console.log("API Key available:", !!apiKey);
    console.log("Using URL:", url);
    console.log("Using model:", model);
    console.log("Active LLM Provider:", activeConfig?.provider || 'default');
    console.log("Browser environment:", {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      language: navigator.language
    });
    
    if (!apiKey) {
      throw new Error("API key is not configured");
    }
    
    console.log("Sending request with language:", language);
    
    // Format request according to the provider
    let requestBody;
    
    switch (activeConfig?.provider) {
      case 'ollama':
        requestBody = {
          model: model,
          prompt: message,
          stream: false
        };
        break;
      
      case 'grok':
        requestBody = {
          model: model,
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
          ]
        };
        break;
      
      case 'openai':
      default:
        // OpenAI-compatible format
        requestBody = {
          model: model,
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
        break;
    }
    
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
      
      console.log("Attempting fetch request to:", url);
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
        console.log("Fetch request succeeded:", data);
        
        // Extract the response based on the provider
        let responseMessage;
        
        switch (activeConfig?.provider) {
          case 'ollama':
            responseMessage = data.response;
            break;
          
          case 'grok':
            responseMessage = data.choices?.[0]?.message?.content;
            break;
          
          case 'openai':
          default:
            responseMessage = data.choices?.[0]?.message?.content;
            break;
        }
        
        if (!responseMessage) {
          responseMessage = "Sorry, I couldn't process your request at this time.";
        }
        
        return {
          message: responseMessage,
          source: activeConfig?.name || "AI Assistant"
        };
      } else {
        console.warn("Fetch failed, status:", response.status);
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText || response.statusText}`);
      }
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
    console.error("Error calling API:", error);
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
        title: "API Error",
        description: error.message || "Failed to connect to the API. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    sendMessage,
  };
}
