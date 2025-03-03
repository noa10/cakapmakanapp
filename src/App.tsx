import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { RequestyProvider } from '@/context/RequestyContext';
import Index from '@/pages/Index';
import Chat from '@/pages/Chat';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import TestChat from '@/pages/TestChat';
import Admin from '@/pages/Admin';
import GrabSelfServe from '@/pages/GrabSelfServe';
import BusinessDashboard from '@/pages/BusinessDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RequestyProvider>
          <Navbar />
          <div className="min-h-screen pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/test-chat" element={<TestChat />} />
              <Route path="/grab-self-serve" element={<GrabSelfServe />} />
              <Route path="/business" element={
                <ProtectedRoute>
                  <BusinessDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
          <Toaster />
        </RequestyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
