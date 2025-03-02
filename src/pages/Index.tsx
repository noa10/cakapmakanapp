
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* Testimonials Section */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70 pointer-events-none"></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Users & Businesses
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied users and businesses on the MalayChat platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">A</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Ahmad Razali</h4>
                    <p className="text-sm text-muted-foreground">Regular User</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I can finally order food in Bahasa Malaysia through chat! The AI understands 
                  exactly what I'm looking for and suggests great options across all platforms."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">S</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Tan</h4>
                    <p className="text-sm text-muted-foreground">Restaurant Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Managing all our food delivery platform listings was a nightmare before MalayChat. 
                  Now we update everything in one place and see all our orders in a single dashboard."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">L</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Lee Wei</h4>
                    <p className="text-sm text-muted-foreground">Tech Enthusiast</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The interface is beautiful and the app is so fast! I love how I can switch between 
                  English and Malay seamlessly, and the recommendations are always spot on."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Simplify Food Ordering?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join MalayChat today and experience the future of food delivery in Malaysia. 
                  Free for consumers, powerful for businesses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/chat" className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full font-medium transition-all-200">
                    Try the Chat
                  </a>
                  <a href="/business" className="bg-white text-primary hover:bg-primary/5 border border-primary/20 px-8 py-3 rounded-full font-medium transition-all-200">
                    Register Your Business
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
