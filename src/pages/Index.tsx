import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const Index = () => {
  const testimonials = [
    {
      name: "Ahmad Razali",
      role: "Regular User",
      initial: "A",
      content: "I can finally order food in Bahasa Malaysia through chat! The AI understands exactly what I'm looking for and suggests great options across all platforms.",
      rating: 5
    },
    {
      name: "Sarah Tan",
      role: "Restaurant Owner",
      initial: "S",
      content: "Managing all our food delivery platform listings was a nightmare before CakapMakan. Now we update everything in one place and see all our orders in a single dashboard.",
      rating: 5
    },
    {
      name: "Lee Wei",
      role: "Tech Enthusiast",
      initial: "L",
      content: "The interface is beautiful and the app is so fast! I love how I can switch between English and Malay seamlessly, and the recommendations are always spot on.",
      rating: 5
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* Testimonials Section */}
        <section className="py-24 bg-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70 pointer-events-none"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '15s' }}></div>
          
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Loved by Users & Businesses
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied users and businesses on the CakapMakan platform.
              </p>
            </motion.div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white border border-border rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:translate-y-[-5px] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-3xl -z-10"></div>
                  
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary font-medium text-lg">
                      {testimonial.initial}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                >
                  Ready to Simplify Food Ordering?
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg text-muted-foreground mb-8"
                >
                  Join CakapMakan today and experience the future of food delivery in Malaysia. 
                  Free for consumers, powerful for businesses.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <a href="/chat" className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center">
                    Try the Chat
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a href="/business" className="bg-white text-primary hover:bg-primary/5 border border-primary/20 px-8 py-3 rounded-full font-medium transition-all flex items-center justify-center">
                    Register Your Business
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
