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
  const [useAgent, setUseAgent] = useState(true);
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
      >
        <Card className="border shadow-md overflow-hidden rounded-xl">
          <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px]">
            {/* Header with controls */}
            <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between bg-card gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {useAgent ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="font-medium">
                    {useAgent ? "AI Food Assistant" : "Standard Chat"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {language === "english" ? "Responding in English" : "Menjawab dalam Bahasa Malaysia"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={clearChat}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-1" />
                      {language === "english" ? "English" : "Bahasa"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("english")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("bahasa")}>
                      Bahasa Malaysia
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant={useAgent ? "default" : "outline"} 
                  size="sm"
                  onClick={toggleAgentMode}
                  className="gap-1"
                >
                  {useAgent ? <Sparkles className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  {useAgent ? "Agent Mode" : "Standard Mode"}
                </Button>
              </div>
            </div>
            
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl p-4",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border shadow-sm"
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.text}
                      </div>
                      {message.source && (
                        <div className="text-xs mt-2 opacity-70 flex items-center">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {message.source}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Suggestion chips */}
            <div className="p-3 border-t bg-card flex gap-2 overflow-x-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary whitespace-nowrap transition-colors flex items-center gap-1 hover:text-primary"
                >
                  {suggestion}
                  <ChevronRight className="h-3 w-3" />
                </button>
              ))}
            </div>
            
            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 rounded-full"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
