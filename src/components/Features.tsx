import React from "react";
import { MessageCircle, ShoppingCart, Globe, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "AI Chat Assistant",
      description:
        "Order food in Malay or English with our intuitive AI chat interface that understands your preferences.",
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: "Multi-Platform Integration",
      description:
        "Access menus from Grab, Shopee Food, and Foodpanda all in one place without switching apps.",
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Business Integration",
      description:
        "Restaurants can sign up once and get listed across all major food delivery platforms in Malaysia.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Order Analytics",
      description:
        "Track your order history, spending patterns, and delivery times across all platforms.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-40 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute bottom-40 right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '15s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '20s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            One App, Multiple Platforms
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with all your favorite food delivery services through a single,
            seamless interface. No more app switching.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white border border-border rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:translate-y-[-5px]"
            >
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a 
            href="/chat" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Try the chat interface now
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
