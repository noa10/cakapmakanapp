import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-[90vh] pt-20 pb-16 flex items-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-accent/5 to-background"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-[5%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2"
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Launching Soon
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance"
              >
                <span className="relative">
                  Malaysia's First{" "}
                  <span className="text-primary relative inline-block">
                    Superapp
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2 text-primary/30"
                      viewBox="0 0 100 8"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,5 C25,0 75,0 100,5 L100,8 L0,8 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>{" "}
                <br className="md:block hidden" />
                for Food Delivery
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-foreground/75 max-w-lg mx-auto lg:mx-0"
              >
                Order food from your favorite restaurants in Malay or English. One chat interface to access all major food delivery platforms.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/chat">
                <Button size="lg" className="px-8 py-6 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Try the Chat Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/business">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base rounded-full hover:bg-primary/5 transition-all"
                >
                  For Businesses
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-muted-foreground"
            >
              <span className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                Grab
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                Shopee Food
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                Foodpanda
              </span>
            </motion.div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative mx-auto lg:mx-0 max-w-sm md:max-w-md lg:max-w-lg hidden md:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-95 -z-10 animate-pulse" style={{ animationDuration: '5s' }}></div>
              <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
                <div className="h-12 bg-secondary/50 rounded-t-3xl flex items-center justify-center">
                  <div className="w-32 h-6 bg-background/40 rounded-full"></div>
                </div>
                <div className="p-4 bg-background">
                  {/* AI Message */}
                  <div className="rounded-2xl bg-white border border-border shadow-sm p-4 mb-4 transform transition-all hover:shadow-md hover:border-primary/30">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">C</div>
                      <div className="flex-1">
                        <div className="h-4 bg-secondary/70 rounded-full w-32 mb-2"></div>
                        <div className="h-20 bg-secondary/50 rounded-lg w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Message */}
                  <div className="rounded-2xl bg-white border border-border shadow-sm p-4 mb-4 transform transition-all hover:shadow-md hover:border-accent/30">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center text-white font-medium shrink-0">U</div>
                      <div className="flex-1">
                        <div className="h-4 bg-secondary/70 rounded-full w-24 mb-2"></div>
                        <div className="h-10 bg-secondary/50 rounded-lg w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Response with Options */}
                  <div className="rounded-2xl bg-white border border-border shadow-sm p-4 transform transition-all hover:shadow-md hover:border-primary/30">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">C</div>
                      <div className="flex-1">
                        <div className="h-4 bg-secondary/70 rounded-full w-40 mb-2"></div>
                        <div className="h-16 bg-secondary/50 rounded-lg w-full mb-2"></div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-16 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"></div>
                          <div className="h-16 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"></div>
                          <div className="h-16 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-16 bg-secondary/50 rounded-b-3xl border-t border-border flex items-center justify-between px-6">
                  <div className="w-full h-10 bg-white rounded-full border border-border shadow-sm px-4 flex items-center justify-between">
                    <div className="h-3 bg-secondary/70 rounded-full w-32"></div>
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
