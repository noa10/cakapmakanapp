
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const BusinessForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    address: "",
    contactName: "",
    email: "",
    phone: "",
    preferredPlatforms: {
      grab: false,
      shopee: false,
      foodpanda: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (platform: 'grab' | 'shopee' | 'foodpanda') => {
    setFormData(prev => ({
      ...prev,
      preferredPlatforms: {
        ...prev.preferredPlatforms,
        [platform]: !prev.preferredPlatforms[platform]
      }
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    // In a real app, you would submit the form data to your backend here
    console.log("Form submitted:", formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-right">
            <div className="space-y-2">
              <label htmlFor="businessName" className="block text-sm font-medium">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your Restaurant Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessType" className="block text-sm font-medium">
                Business Type
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Select Type</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Café</option>
                <option value="bakery">Bakery</option>
                <option value="fastFood">Fast Food</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                Business Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Full address including city and postcode"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4 animate-fade-left">
            <div className="space-y-2">
              <label htmlFor="contactName" className="block text-sm font-medium">
                Contact Person Name
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+60 ..."
                required
              />
            </div>
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4 animate-fade-left">
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Platforms to List On
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="grab"
                    checked={formData.preferredPlatforms.grab}
                    onChange={() => handleCheckboxChange('grab')}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="grab" className="ml-2 text-sm">
                    Grab Food
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shopee"
                    checked={formData.preferredPlatforms.shopee}
                    onChange={() => handleCheckboxChange('shopee')}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="shopee" className="ml-2 text-sm">
                    Shopee Food
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="foodpanda"
                    checked={formData.preferredPlatforms.foodpanda}
                    onChange={() => handleCheckboxChange('foodpanda')}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="foodpanda" className="ml-2 text-sm">
                    Foodpanda
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p>
                By submitting this form, you agree to our Terms of Service and Privacy Policy. 
                We'll help you list your business on the selected platforms.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit">
                Submit Application
              </Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center space-y-4 py-6 animate-fade-up">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium">Application Submitted!</h3>
            <p className="text-muted-foreground">
              Thank you for registering your business. Our team will review your application
              and contact you within 1-2 business days to complete the setup process.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = "/"}
            >
              Return to Home
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      {step < 4 && (
        <div className="bg-secondary/50 border-b border-border p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Business Registration</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-2 rounded-full ${
                    s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6">
        {renderStep()}
      </form>
    </div>
  );
};

export default BusinessForm;
