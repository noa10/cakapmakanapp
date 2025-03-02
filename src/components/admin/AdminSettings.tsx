
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Agent settings
  const [agentSettings, setAgentSettings] = useState({
    enableNLU: true,
    enableBilingual: true,
    defaultLanguage: 'english'
  });
  
  // Platform settings
  const [platformSettings, setPlatformSettings] = useState({
    enableGrabFood: true,
    enableFoodPanda: true,
    enableDeliverEat: true,
    enableShopeeFood: true
  });

  const handleSaveSettings = (settingsType) => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings saved',
        description: `${settingsType} settings have been updated successfully.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Settings</h2>
      
      <Tabs defaultValue="agent">
        <TabsList>
          <TabsTrigger value="agent">Agent Settings</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agent" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>
                Configure how the AI agent behaves when interacting with users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Natural Language Understanding</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable advanced NLU capabilities for better understanding user requests
                  </p>
                </div>
                <Switch 
                  checked={agentSettings.enableNLU}
                  onCheckedChange={(checked) => 
                    setAgentSettings({...agentSettings, enableNLU: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bilingual Support</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable support for both English and Bahasa Malaysia
                  </p>
                </div>
                <Switch 
                  checked={agentSettings.enableBilingual}
                  onCheckedChange={(checked) => 
                    setAgentSettings({...agentSettings, enableBilingual: checked})
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Default Language</Label>
                <div className="flex gap-4">
                  <Button
                    variant={agentSettings.defaultLanguage === 'english' ? 'default' : 'outline'}
                    onClick={() => setAgentSettings({...agentSettings, defaultLanguage: 'english'})}
                  >
                    English
                  </Button>
                  <Button
                    variant={agentSettings.defaultLanguage === 'bahasa' ? 'default' : 'outline'}
                    onClick={() => setAgentSettings({...agentSettings, defaultLanguage: 'bahasa'})}
                  >
                    Bahasa Malaysia
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>API Configuration</Label>
                <Input placeholder="Requesty API Endpoint" defaultValue="https://router.requesty.ai" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('Agent')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Platforms</CardTitle>
              <CardDescription>
                Configure which food delivery platforms are active in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>GrabFood</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable integration with GrabFood delivery platform
                  </p>
                </div>
                <Switch 
                  checked={platformSettings.enableGrabFood}
                  onCheckedChange={(checked) => 
                    setPlatformSettings({...platformSettings, enableGrabFood: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>FoodPanda</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable integration with FoodPanda delivery platform
                  </p>
                </div>
                <Switch 
                  checked={platformSettings.enableFoodPanda}
                  onCheckedChange={(checked) => 
                    setPlatformSettings({...platformSettings, enableFoodPanda: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>DeliverEat</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable integration with DeliverEat delivery platform
                  </p>
                </div>
                <Switch 
                  checked={platformSettings.enableDeliverEat}
                  onCheckedChange={(checked) => 
                    setPlatformSettings({...platformSettings, enableDeliverEat: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ShopeeFood</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable integration with ShopeeFood delivery platform
                  </p>
                </div>
                <Switch 
                  checked={platformSettings.enableShopeeFood}
                  onCheckedChange={(checked) => 
                    setPlatformSettings({...platformSettings, enableShopeeFood: checked})
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('Platform')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">
                User management features are under development. Check back soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
