import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Loader2, Bot, MessageSquare, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRequestyAgent } from "@/integrations/requesty/useRequestyAgent";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  source?: string;
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I'm your AI assistant. How can I help you order food today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"english" | "bahasa">("english");
  const [useAgent, setUseAgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use our RequestyAgent hook
  const { sendMessage: sendAgentMessage, isLoading: agentLoading, resetConversation } = useRequestyAgent();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      if (useAgent) {
        // Use the Requesty.ai agent
        const response = await sendAgentMessage(inputValue, language === "bahasa" ? "malay" : "english");
        
        if (response) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            sender: "ai",
            text: response.message,
            timestamp: new Date(),
            source: response.source,
          };
          
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error("No response from agent");
        }
      } else {
        // Fallback to Supabase Edge Function
        const { data, error } = await supabase.functions.invoke("generate-response", {
          body: { 
            message: inputValue,
            language: language === "bahasa" ? "malay" : "english"
          }
        });
        
        if (error) {
          throw error;
        }
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          sender: "ai",
          text: data.message,
          timestamp: new Date(),
          source: "Supabase Edge Function",
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: "Sorry, I'm having trouble connecting to the backend. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === "english" ? "bahasa" : "english";
    setLanguage(newLanguage);
    
    toast({
      title: "Language Changed",
      description: newLanguage === "english" 
        ? "AI will now respond in English" 
        : "AI akan menjawab dalam Bahasa Malaysia",
      variant: "default",
    });
  };
  
  const toggleAgentMode = () => {
    setUseAgent((prev) => !prev);
    
    toast({
      title: "Mode Changed",
      description: !useAgent 
        ? "Using intelligent agent mode" 
        : "Using standard chat mode",
      variant: "default",
    });
    
    // Reset conversation when switching modes
    resetConversation();
    setMessages([{
      id: "welcome",
      sender: "ai",
      text: !useAgent 
        ? "Hello! I'm your AI food ordering assistant. How can I help you today?" 
        : "Hello! I'm in standard chat mode now. How can I help?",
      timestamp: new Date(),
    }]);
  };
  
  const clearChat = () => {
    resetConversation();
    setMessages([{
      id: "welcome",
      sender: "ai",
      text: "Hello! I'm your AI assistant. How can I help you order food today?",
      timestamp: new Date(),
    }]);
    
    toast({
      title: "Chat Cleared",
      description: "Started a new conversation",
      variant: "default",
    });
  };

  // Suggestion chips for common queries
  const suggestions = [
    "Find me a good restaurant nearby",
    "What's the best Malaysian food?",
    "Order nasi lemak from Grab",
    "Track my FoodPanda order"
  ];

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Chat Messages */}
        <Card className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.source && (
                    <p className="text-xs mt-1 opacity-70">
                      Source: {message.source}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Language Toggle */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === "english" ? "Switch to BM" : "Switch to English"}
          </Button>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAgentMode}
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            {useAgent ? "Switch to Standard Mode" : "Switch to Agent Mode"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(suggestion)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {suggestion}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
