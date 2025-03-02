
import React from "react";
import { MessageCircle, ShoppingCart, Globe, BarChart } from "lucide-react";

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

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-40 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One App, Multiple Platforms
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with all your favorite food delivery services through a single,
            seamless interface. No more app switching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-border rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
