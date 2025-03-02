
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Users, MessageSquare, ShoppingCart } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversations: 0,
    totalOrders: 0,
    lastWeekStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        
        if (userError) throw userError;

        // For now, just use mock data for other metrics
        // In a real implementation, you would fetch this from your database
        
        const mockWeeklyData = [
          { name: 'Mon', users: 4, conversations: 12, orders: 2 },
          { name: 'Tue', users: 3, conversations: 15, orders: 4 },
          { name: 'Wed', users: 5, conversations: 20, orders: 6 },
          { name: 'Thu', users: 2, conversations: 18, orders: 5 },
          { name: 'Fri', users: 6, conversations: 25, orders: 8 },
          { name: 'Sat', users: 8, conversations: 30, orders: 10 },
          { name: 'Sun', users: 7, conversations: 22, orders: 7 },
        ];

        setStats({
          totalUsers: userCount || 0,
          totalConversations: 142, // Mock data
          totalOrders: 42, // Mock data
          lastWeekStats: mockWeeklyData
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="h-6 w-6 text-blue-500" />}
          change="+12%"
        />
        <StatCard 
          title="Conversations" 
          value={stats.totalConversations} 
          icon={<MessageSquare className="h-6 w-6 text-green-500" />}
          change="+23%"
        />
        <StatCard 
          title="Orders Placed" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="h-6 w-6 text-purple-500" />}
          change="+8%"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.lastWeekStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#10b981" name="Conversations" />
                <Bar dataKey="orders" fill="#8b5cf6" name="Orders" />
                <Bar dataKey="users" fill="#3b82f6" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon, change }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <div className="flex items-center mt-1">
            <span className="text-xs font-medium text-green-500 flex items-center">
              {change} <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>
        <div className="bg-background p-3 rounded-full">{icon}</div>
      </div>
    </CardContent>
  </Card>
);
