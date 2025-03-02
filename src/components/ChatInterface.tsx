
import React, { useState, useRef, useEffect } from "react";
import { Send, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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
      // Call the Supabase Edge Function to get AI response
      const { data, error } = await supabase.functions.invoke("generate-response", {
        body: { 
          message: inputValue,
          language: language
        },
      });

      if (error) {
        throw error;
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.message,
        timestamp: new Date(),
        source: data.source,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
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

  return (
    <Card className="p-4 md:p-6 shadow-md border-primary/10 bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col h-[60vh] md:h-[70vh]">
        {/* Header with language selection */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Food Ordering Assistant</h3>
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
                {message.source && (
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
            disabled={isLoading || !user}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !user || !inputValue.trim()}
          >
            <Send size={18} />
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
