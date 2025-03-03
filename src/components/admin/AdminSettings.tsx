import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement settings save
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="CakapMakan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input id="siteDescription" defaultValue="Your AI-powered food ordering assistant" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Switch id="maintenance" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiModel">AI Model</Label>
                <Input id="aiModel" defaultValue="gpt-4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input id="temperature" type="number" defaultValue="0.7" step="0.1" min="0" max="1" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableLangGraph">Enable LangGraph</Label>
                <Switch id="enableLangGraph" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch id="emailNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="orderUpdates">Order Updates</Label>
                <Switch id="orderUpdates" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="systemAlerts">System Alerts</Label>
                <Switch id="systemAlerts" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings; 