
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversation data
  const mockConversations = [
    {
      id: '1',
      user: 'Amir Khan',
      timestamp: '2025-03-02T14:30:00Z',
      platform: 'GrabFood',
      language: 'English',
      intent: 'Food Recommendation',
      excerpt: 'I want to order some nasi lemak for delivery',
      status: 'completed'
    },
    {
      id: '2',
      user: 'Siti Aminah',
      timestamp: '2025-03-02T13:15:00Z',
      platform: 'FoodPanda',
      language: 'Bahasa Malaysia',
      intent: 'Order Tracking',
      excerpt: 'Di mana pesanan saya? Sudah 30 minit',
      status: 'completed'
    },
    {
      id: '3',
      user: 'John Lee',
      timestamp: '2025-03-02T12:45:00Z',
      platform: 'DeliverEat',
      language: 'English',
      intent: 'Platform Inquiry',
      excerpt: 'Which platform has the lowest delivery fees?',
      status: 'completed'
    },
    {
      id: '4',
      user: 'Nurul Huda',
      timestamp: '2025-03-02T11:20:00Z',
      platform: 'GrabFood',
      language: 'Bahasa Malaysia',
      intent: 'Food Recommendation',
      excerpt: 'Boleh cadangkan restoran yang ada ayam goreng korea?',
      status: 'completed'
    },
    {
      id: '5',
      user: 'David Wong',
      timestamp: '2025-03-02T10:05:00Z',
      platform: 'ShopeeFood',
      language: 'English',
      intent: 'Order Issue',
      excerpt: 'My order is missing an item. Can you help?',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // In a real app, fetch conversation data from Supabase
    // For now, use mock data
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  const filteredConversations = conversations.filter(
    conv => 
      conv.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-MY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-semibold">User Conversations</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Conversations</TabsTrigger>
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="bahasa">Bahasa Malaysia</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <ConversationTable 
            conversations={filteredConversations} 
            formatDate={formatDate} 
          />
        </TabsContent>
        
        <TabsContent value="english" className="mt-6">
          <ConversationTable 
            conversations={filteredConversations.filter(c => c.language === 'English')} 
            formatDate={formatDate} 
          />
        </TabsContent>
        
        <TabsContent value="bahasa" className="mt-6">
          <ConversationTable 
            conversations={filteredConversations.filter(c => c.language === 'Bahasa Malaysia')} 
            formatDate={formatDate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ConversationTable = ({ conversations, formatDate }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse table-auto">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Time</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Platform</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Language</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Intent</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Conversation</th>
          <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {conversations.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-muted-foreground">
              No conversations found
            </td>
          </tr>
        ) : (
          conversations.map((conv) => (
            <tr key={conv.id} className="border-b border-border hover:bg-muted/50">
              <td className="px-4 py-3">{conv.user}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(conv.timestamp)}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {conv.platform}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">{conv.language}</td>
              <td className="px-4 py-3 text-sm">{conv.intent}</td>
              <td className="px-4 py-3 text-sm max-w-xs truncate">{conv.excerpt}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm">View</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
