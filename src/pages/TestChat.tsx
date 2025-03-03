import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { sendMessageToRequesty } from "@/integrations/requesty";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  source?: string;
  isError?: boolean;
};

const TestChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "This is a direct test of the Requesty.ai integration without authentication. Enter a message to test.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    console.log("Test chat submit handler triggered");
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const userInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
  
    try {
      // Test processing message
      setMessages(prev => [...prev, {
        id: 'processing-' + Date.now(),
        sender: 'ai',
        text: 'Processing...',
        timestamp: new Date()
      }]);
      
      // Try to directly use the integration function
      console.log("Directly testing Requesty.ai integration with message:", userInput);
      
      const response = await sendMessageToRequesty(userInput, 'english', 'test-user');
      
      console.log("Direct test received response:", response);
  
      // Remove the processing message and add the real AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.id.startsWith('processing-'));
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: response.message,
          timestamp: new Date(),
          source: response.source,
        }];
      });
    } catch (error: any) {
      console.error("Test chat error:", error);
      
      // Add error message as AI response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `ERROR: ${error.message}`,
        timestamp: new Date(),
        isError: true
      };
      
      // Remove any processing messages and add the error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.id.startsWith('processing-'));
        return [...filtered, errorMessage];
      });
      
      toast({
        title: "Test Error",
        description: error.message || "Test failed. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Requesty.ai Integration Test
              </h1>
              <p className="text-lg text-muted-foreground">
                Direct testing of the Requesty.ai integration without authentication requirements.
              </p>
            </div>
            
            <Card className="p-4 md:p-6 shadow-md border-primary/10 bg-white/80 backdrop-blur-sm animate-fade-up">
              <div className="flex flex-col h-[60vh] md:h-[70vh]">
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
                            ? "bg-blue-500 text-white rounded-br-none"
                            : message.isError 
                              ? "bg-red-100 text-red-800 rounded-bl-none" 
                              : "bg-muted rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        {message.source && (
                          <p className="text-xs mt-1 opacity-70">
                            Source: {message.source}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
          
                {/* Input area */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a test message..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !inputValue.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </form>
                
                {/* Debug info */}
                <div className="mt-4 border-t pt-2 text-xs text-muted-foreground">
                  <p>Debug Info:</p>
                  <p>API Key: {import.meta.env.VITE_REQUESTY_API_KEY ? "Present ✓" : "Missing ✗"}</p>
                  <p>Status: {isLoading ? "Loading..." : "Ready"}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestChat; 