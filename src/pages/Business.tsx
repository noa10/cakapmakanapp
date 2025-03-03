import React from "react";
import BusinessForm from "@/components/BusinessForm";
import { Check } from "lucide-react";

const Business = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Register Your Business
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our platform and get listed on Grab, Shopee Food, and Foodpanda with a single registration.
              </p>
            </div>
            
            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl border border-border p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">One Registration Process</h3>
                <p className="text-muted-foreground">
                  Fill out a single form to get listed on all major food delivery platforms in Malaysia.
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-border p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Free One-Month Trial</h3>
                <p className="text-muted-foreground">
                  Try our services free for a month with full access to all features and platform integrations.
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-border p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Unified Dashboard</h3>
                <p className="text-muted-foreground">
                  Manage all your orders, menus, and analytics across platforms in one centralized dashboard.
                </p>
              </div>
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
              <BusinessForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Business;
