import React from "react";
import ChatInterface from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Malaysian Food Ordering Assistant
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Chat with our AI assistant in Bahasa Malaysia or English to order food from GrabFood, Foodpanda, and ShopeeFood.
              </p>
              <div className="flex justify-center space-x-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  GrabFood
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  Foodpanda
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  ShopeeFood
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Our AI can understand your preferences, make recommendations, and help you place orders in your preferred language.
              </p>
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
