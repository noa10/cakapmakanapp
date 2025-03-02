
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendIcon, Mic, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  options?: string[];
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your MalayChat assistant. How can I help you order food today?",
      sender: "assistant",
      timestamp: new Date(),
      options: ["Show me nearby restaurants", "Order from Grab", "Order from Foodpanda"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock response for demo
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "assistant",
        timestamp: new Date(),
        options: ["View menu", "Change restaurant", "Checkout"]
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Get mock bot responses based on user input
  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("grab") || lowerInput.includes("order")) {
      return "I can help you order from Grab! Would you like to browse restaurants near you or do you have a specific restaurant in mind?";
    } else if (lowerInput.includes("foodpanda")) {
      return "Let's order from Foodpanda! They have a promotion running today with free delivery on orders above RM30.";
    } else if (lowerInput.includes("shopee")) {
      return "Shopee Food has some great deals today! Would you like me to show you the top-rated restaurants on Shopee Food?";
    } else if (lowerInput.includes("menu") || lowerInput.includes("food")) {
      return "Here are some popular options: 1. Nasi Lemak, 2. Char Kuey Teow, 3. Roti Canai. Would you like to add any of these to your cart?";
    } else {
      return "I'd be happy to help you order food. Would you like to order from Grab, Foodpanda, or Shopee Food?";
    }
  };

  // Handle option click
  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: option,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";
      
      if (option.includes("nearby")) {
        responseContent = "Here are some popular restaurants near you: 1. Malaysian Delight, 2. Spice Garden, 3. Noodle House. Which one would you like to explore?";
      } else if (option.includes("Grab")) {
        responseContent = "I'll help you order from Grab. They have a special offer today - 20% off on selected restaurants. What type of cuisine are you in the mood for?";
      } else if (option.includes("Foodpanda")) {
        responseContent = "Let's order from Foodpanda! They have free delivery on your first order. Would you like to see trending restaurants or search for something specific?";
      } else if (option.includes("menu")) {
        responseContent = "Here's the menu from Malaysian Delight:\n1. Nasi Lemak - RM12\n2. Char Kuey Teow - RM14\n3. Chicken Rice - RM10\n\nWhat would you like to order?";
      } else if (option.includes("Checkout")) {
        responseContent = "Ready to checkout! Your order summary:\n- 1x Nasi Lemak (RM12)\n- 1x Teh Tarik (RM3)\nSubtotal: RM15\nDelivery: RM5\nTotal: RM20\n\nWould you like to proceed with payment?";
      } else {
        responseContent = "I'm here to help! Would you like to browse restaurants, view menus, or place an order?";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
        options: ["View full menu", "Add to cart", "Change restaurant"]
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px] md:h-[700px]">
      {/* Chat Header */}
      <div className="bg-secondary/50 border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">MalayChat Food Assistant</h3>
            <p className="text-xs text-muted-foreground">Online • Available 24/7</p>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn(
            "flex",
            message.sender === "user" ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-[80%] rounded-2xl p-4",
              message.sender === "user" ? 
                "bg-primary text-primary-foreground rounded-tr-none" : 
                "bg-secondary text-secondary-foreground rounded-tl-none"
            )}>
              <div className="flex items-start space-x-2">
                {message.sender === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="whitespace-pre-line">{message.content}</p>
                  
                  {message.options && message.sender === "assistant" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-left transition-all-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary/30 flex-shrink-0 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-tl-none p-4 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-primary/30 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
                  <div className="h-2 w-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-secondary/50 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full flex-shrink-0"
            disabled={inputValue.trim() === ""}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
