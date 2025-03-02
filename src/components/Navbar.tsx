
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="font-medium text-xl md:text-2xl transition-all-200 hover:opacity-80"
          >
            <span className="text-primary font-semibold">Cakap</span>
            <span className="text-secondary font-light">Makan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary transition-all-200"
            >
              Home
            </Link>
            <Link
              to="/chat"
              className="text-foreground/80 hover:text-primary transition-all-200"
            >
              Chat
            </Link>
            <Link
              to="/business"
              className="text-foreground/80 hover:text-primary transition-all-200"
            >
              Business
            </Link>
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary transition-all-200"
            >
              About
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    size="sm" 
                    className="ml-2" 
                    variant="outline"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=signup">
                  <Button 
                    size="sm" 
                    className="ml-2 bg-malaysia-blue hover:bg-malaysia-blue/90 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border shadow-lg animate-fade-down">
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground/80 hover:text-primary transition-all-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/chat"
                className="text-foreground/80 hover:text-primary transition-all-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chat
              </Link>
              <Link
                to="/business"
                className="text-foreground/80 hover:text-primary transition-all-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Business
              </Link>
              <Link
                to="/"
                className="text-foreground/80 hover:text-primary transition-all-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        My Profile
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-malaysia-red hover:bg-malaysia-red/90 text-white"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?tab=signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-malaysia-blue hover:bg-malaysia-blue/90 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
