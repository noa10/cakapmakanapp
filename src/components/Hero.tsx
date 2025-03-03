
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/30 to-background"></div>
      
      {/* Circle Decorations */}
      <div className="absolute top-20 right-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="space-y-4 animate-fade-up">
              <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Launching Soon
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                <span className="relative">
                  Malaysia's First{" "}
                  <span className="text-primary relative">
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
                <br />
                for Food Delivery
              </h1>
              <p className="text-lg md:text-xl text-foreground/75 max-w-lg mx-auto lg:mx-0">
                Order food from your favorite restaurants in Malay or English. One chat to access all platforms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "100ms" }}>
              <Link to="/chat">
                <Button size="lg" className="px-8 py-6 text-base rounded-full">
                  Try the Chat Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/business">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base rounded-full"
                >
                  For Businesses
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "200ms" }}>
              <span className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Grab
              </span>
              <span className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Shopee Food
              </span>
              <span className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Foodpanda
              </span>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative mx-auto lg:mx-0 max-w-sm md:max-w-md lg:max-w-lg animate-fade-up hidden md:block" style={{ animationDelay: "300ms" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-95 -z-10"></div>
              <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
                <div className="h-12 bg-secondary rounded-t-3xl flex items-center justify-center">
                  <div className="w-32 h-6 bg-background/40 rounded-full"></div>
                </div>
                <div className="p-4 bg-background">
                  <div className="rounded-2xl bg-white border border-border shadow-sm p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">C</div>
                      <div className="flex-1">
                        <div className="h-4 bg-secondary rounded-full w-32 mb-2"></div>
                        <div className="h-20 bg-secondary rounded-lg w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-2xl bg-white border border-border shadow-sm p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center text-primary font-medium">U</div>
                      <div className="flex-1">
                        <div className="h-4 bg-secondary rounded-full w-24 mb-2"></div>
                        <div className="h-10 bg-secondary rounded-lg w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-2xl bg-white border border-border shadow-sm p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">C</div>
                      <div className="flex-1">
                        <div className="h-4 bg-secondary rounded-full w-40 mb-2"></div>
                        <div className="h-16 bg-secondary rounded-lg w-full mb-2"></div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-16 bg-secondary rounded-lg"></div>
                          <div className="h-16 bg-secondary rounded-lg"></div>
                          <div className="h-16 bg-secondary rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-16 bg-secondary rounded-b-3xl border-t border-border flex items-center justify-between px-6">
                  <div className="w-full h-10 bg-white rounded-full border border-border shadow-sm px-4 flex items-center justify-between">
                    <div className="h-3 bg-secondary rounded-full w-32"></div>
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
