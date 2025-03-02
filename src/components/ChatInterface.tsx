import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Loader2, Bot, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRequestyAgent } from "@/integrations/requesty/useRequestyAgent";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use our RequestyAgent hook
  const { sendMessage: sendAgentMessage, isLoading: agentLoading, resetConversation } = useRequestyAgent();

  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Capture console logs for debugging
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Function to add to debug logs
    const addDebugLog = (type: string, args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setDebugLogs(prev => [...prev, `[${type}] ${message}`].slice(-50)); // Keep last 50 logs
    };
    
    // Override console methods
    console.log = (...args) => {
      originalConsoleLog(...args);
      addDebugLog('LOG', args);
    };
    
    console.error = (...args) => {
      originalConsoleError(...args);
      addDebugLog('ERROR', args);
    };
    
    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addDebugLog('WARN', args);
    };
    
    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
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
      let responseData;

      if (useAgent) {
        // Use the RequestyAgent to process the message
        responseData = await sendAgentMessage(inputValue, language);
      } else {
        // Use the Supabase Edge Function to get AI response
        const { data, error } = await supabase.functions.invoke("generate-response", {
          body: { 
            message: inputValue,
            language: language
          },
        });

        if (error) {
          console.error("Error calling Edge Function:", error);
          throw error;
        }
        
        responseData = data;
      }
      
      if (!responseData) {
        throw new Error("Failed to get response");
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseData.message,
        timestamp: new Date(),
        source: responseData.source,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      
      // Add fallback AI response on error
      const errorMessage = language === "english" 
        ? "Sorry, I'm having trouble connecting to the backend. Please try again later."
        : "Maaf, saya mengalami masalah menghubungkan ke sistem. Sila cuba lagi kemudian.";
      
      const aiErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: errorMessage,
        timestamp: new Date(),
        source: "Error",
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
      
      toast({
        title: language === "english" ? "Error" : "Ralat",
        description: language === "english" 
          ? "Failed to get response. Please try again."
          : "Gagal mendapatkan respons. Sila cuba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "bahasa" : "english");
    // Update welcome message based on language
    const welcomeMessage = language === "english" 
      ? "Halo! Saya ialah pembantu AI anda. Bagaimana saya boleh membantu anda memesan makanan hari ini?"
      : "Hello! I'm your AI assistant. How can I help you order food today?";
    
    toast({
      title: language === "english" ? "Bahasa Malaysia" : "English",
      description: language === "english" ? "Beralih ke Bahasa Malaysia" : "Switched to English",
    });
  };

  const toggleAgentMode = () => {
    setUseAgent(!useAgent);
    // Reset conversation when switching modes
    resetConversation();
    
    // Add message about switching modes
    const switchMessage: Message = {
      id: Date.now().toString(),
      sender: "ai",
      text: useAgent 
        ? "Switched to standard chat mode."
        : "Switched to intelligent agent mode. I can now help with specific food ordering tasks.",
      timestamp: new Date(),
      source: "System",
    };
    setMessages((prev) => [...prev, switchMessage]);
    
    toast({
      title: useAgent ? "Standard Mode" : "Agent Mode",
      description: useAgent ? "Switched to standard chat" : "Switched to intelligent agent",
    });
  };

  return (
    <Card className="p-4 md:p-6 shadow-md border-primary/10 bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col h-[60vh] md:h-[70vh]">
        {/* Header with language selection */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Food Ordering Assistant</h3>
          <div className="flex gap-2">
            <Button 
              variant={useAgent ? "default" : "outline"} 
              size="sm" 
              className="gap-2"
              onClick={toggleAgentMode}
            >
              <Bot size={16} />
              {useAgent ? "Agent Mode" : "Standard Mode"}
            </Button>
            
            <Button
              variant={showDebug ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Bug size={16} />
              Debug
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe size={16} />
                  {language === "english" ? "English" : "Bahasa Malaysia"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => language !== "english" && toggleLanguage()}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => language !== "bahasa" && toggleLanguage()}>
                  Bahasa Malaysia
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Debug panel */}
        {showDebug && (
          <div className="mb-4 p-2 bg-black/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">Debug Information</h4>
            <div className="text-xs bg-black/20 p-2 rounded h-[15vh] overflow-y-auto font-mono">
              {debugLogs.length === 0 ? (
                <p>No debug logs yet. Send a message to see connection details.</p>
              ) : (
                debugLogs.map((log, index) => (
                  <pre key={index} className="whitespace-pre-wrap break-words mb-1">
                    {log}
                  </pre>
                ))
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDebugLogs([])}
                className="text-xs"
              >
                Clear Logs
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  // Test network connectivity
                  console.log("Testing connectivity...");
                  fetch("https://httpbin.org/get")
                    .then(res => res.json())
                    .then(data => console.log("Connectivity test success:", data))
                    .catch(err => console.error("Connectivity test failed:", err));
                }}
                className="text-xs"
              >
                Test Connection
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  console.log("Environment:", {
                    apiKey: import.meta.env?.VITE_REQUESTY_API_KEY ? "Set" : "Not set",
                    supabaseUrl: import.meta.env?.VITE_SUPABASE_URL ? "Set" : "Not set",
                    devMode: import.meta.env.DEV ? "Development" : "Production",
                    browser: navigator.userAgent,
                  });
                }}
                className="text-xs"
              >
                Show Environment
              </Button>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.source && message.source !== "Error" && (
                  <p className="text-xs mt-1 opacity-70">
                    {language === "english" ? "Source" : "Sumber"}: {message.source}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        {user && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputValue("Recommend me something to eat")}
              className="text-xs"
            >
              {language === "english" ? "Food recommendations" : "Cadangan makanan"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputValue("I want to order nasi lemak")}
              className="text-xs"
            >
              {language === "english" ? "Order food" : "Pesan makanan"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputValue("Track my order status")}
              className="text-xs"
            >
              {language === "english" ? "Track order" : "Jejak pesanan"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputValue("Which food platforms do you support?")}
              className="text-xs"
            >
              {language === "english" ? "Supported platforms" : "Platform yang disokong"}
            </Button>
          </div>
        )}

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              user
                ? language === "english" 
                  ? "Type your food order or question..." 
                  : "Taip pesanan makanan atau soalan anda..."
                : language === "english"
                ? "Sign in to send messages"
                : "Log masuk untuk menghantar mesej"
            }
            className="flex-1"
            disabled={isLoading || agentLoading || !user}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || agentLoading || !user || !inputValue.trim()}
          >
            {isLoading || agentLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </form>
        {!user && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {language === "english" 
              ? "Please " 
              : "Sila "}
            <a href="/auth" className="text-primary hover:underline">
              {language === "english" ? "sign in" : "log masuk"}
            </a>
            {language === "english"
              ? " to chat with the AI assistant."
              : " untuk berbual dengan pembantu AI."}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ChatInterface;
