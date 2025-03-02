import { useState, useEffect } from "react";
import { createAgent, RequestyAgent } from "./agent";
import { useToast } from "@/hooks/use-toast";

export function useRequestyAgent() {
  const [agent, setAgent] = useState<RequestyAgent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize the agent on component mount
  useEffect(() => {
    const initializeAgent = () => {
      try {
        // Get API key from environment
        const apiKey = import.meta.env.VITE_REQUESTY_API_KEY as string;
        
        if (!apiKey) {
          console.error("Requesty API key is missing");
          toast({
            title: "Configuration Error",
            description: "Requesty API key is not configured.",
            variant: "destructive",
          });
          return;
        }
        
        // Create and set the agent
        const newAgent = createAgent(apiKey);
        setAgent(newAgent);
      } catch (error) {
        console.error("Failed to initialize agent:", error);
        toast({
          title: "Agent Initialization Error",
          description: "Failed to initialize the AI agent. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeAgent();
  }, [toast]);

  // Send a message to the agent
  const sendMessage = async (message: string, language: string = 'english') => {
    if (!agent) {
      console.error("Agent not initialized when trying to send message");
      toast({
        title: "Agent Not Ready",
        description: "The AI agent is not initialized yet. Please try again.",
        variant: "destructive",
      });
      return null;
    }

    console.log(`Sending message to agent: "${message}" (language: ${language})`);
    setIsLoading(true);

    try {
      // Process the message through the agent
      console.log("Agent state before processing:", agent.getConversationHistory());
      const response = await agent.processMessage(message, language);
      console.log("Agent response received:", response);
      return response;
    } catch (error: any) {
      console.error("Detailed error sending message to agent:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause,
        originalError: error
      });
      
      toast({
        title: "Agent Error",
        description: `Failed to get a response: ${error.message}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the agent's conversation
  const resetConversation = () => {
    if (agent) {
      agent.resetConversation();
    }
  };

  return {
    agent,
    isLoading,
    sendMessage,
    resetConversation,
    isReady: !!agent,
  };
} 