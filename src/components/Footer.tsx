import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/10 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-primary">Cakap</span>
              <span className="text-xl font-light">Makan</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Malaysia's first AI-powered superapp for food ordering. 
              Connect with all major food delivery platforms through one seamless chat interface.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* For Users */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-foreground/70">For Users</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Supported Platforms
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Try the Chat
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Businesses */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-foreground/70">For Businesses</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/business" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Integration Guide
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-foreground/70">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <a href="mailto:hello@cakapmakan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  hello@cakapmakan.com
                </a>
              </li>
              <li>
                <p className="text-sm text-muted-foreground">
                  Kuala Lumpur, Malaysia
                </p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} CakapMakan. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
