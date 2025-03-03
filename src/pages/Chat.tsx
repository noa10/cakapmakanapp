
import React from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/Footer";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Malaysian Food Ordering Assistant
              </h1>
              <p className="text-lg text-muted-foreground">
                Chat with our AI assistant in Bahasa Malaysia or English to order food from GrabFood, Foodpanda, and ShopeeFood.
              </p>
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
