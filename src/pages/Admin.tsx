import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminConversations } from '@/components/admin/AdminConversations';
import { AdminSettings } from '@/components/admin/AdminSettings';
import ErrorFallback from '@/components/ErrorFallback';
import { StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { OrderState, OrderStateSchema } from "@/utils/state";
import { GrabFoodService } from "@/services/grabfood";

const Admin = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        // Check if user has admin role in profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          throw error;
        }
        
        setIsAdmin(data?.is_admin || false);
      } catch (err: any) {
        console.error('Error checking admin status:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to verify admin privileges',
          variant: 'destructive'
        });
      } finally {
        setIsCheckingRole(false);
      }
    };

    if (user) {
      checkAdminStatus();
    } else if (!loading) {
      setIsCheckingRole(false);
    }
  }, [user, loading, toast]);

  // Handle reset error
  const handleReset = () => {
    setError(null);
    window.location.reload();
  };

  if (loading || isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={handleReset} />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="conversations">
          <AdminConversations />
        </TabsContent>
        
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
