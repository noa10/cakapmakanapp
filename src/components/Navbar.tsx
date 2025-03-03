import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

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

    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error checking admin status:', error);
            return;
          }
          
          // Use type assertion and safely access the property
          if (data && !('error' in data)) {
            setIsAdmin((data as { is_admin?: boolean }).is_admin || false);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/chat" },
    { name: "Business", path: "/business" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-primary">Cakap</span>
            <span className="text-xl font-light">Makan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth?mode=signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <div className="flex flex-col space-y-1">
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm font-medium hover:text-primary"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-3 py-2 text-sm font-medium hover:text-primary"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="px-3 py-2 text-sm font-medium text-destructive hover:text-destructive"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link to="/auth?mode=signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="w-full">
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
