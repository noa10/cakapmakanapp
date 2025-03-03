import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type ApiProvider = 'openai' | 'ollama' | 'grok';

interface ConfigProfile {
  id: string;
  name: string;
  provider: ApiProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
}

export const AdminSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [agentSettings, setAgentSettings] = useState({
    enableNLU: true,
    enableBilingual: true,
    defaultLanguage: 'english'
  });
  
  const [platformSettings, setPlatformSettings] = useState({
    enableGrabFood: true,
    enableFoodPanda: true,
    enableDeliverEat: true,
    enableShopeeFood: true
  });

  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>('openai');
  const [configProfiles, setConfigProfiles] = useState<ConfigProfile[]>([
    {
      id: 'default-openai',
      name: 'OpenAI GPT-4o',
      provider: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '****************************************',
      model: 'gpt-4o',
      isActive: true
    }
  ]);
  
  const [newProfile, setNewProfile] = useState<ConfigProfile>({
    id: '',
    name: '',
    provider: 'openai',
    baseUrl: '',
    apiKey: '',
    model: '',
    isActive: false
  });
  
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const providerOptions = [
    { value: 'openai', label: 'OpenAI Compatible' },
    { value: 'ollama', label: 'Ollama' },
    { value: 'grok', label: 'Grok' }
  ];

  const defaultBaseUrls = {
    openai: 'https://api.openai.com/v1',
    ollama: 'http://localhost:11434',
    grok: 'https://api.grok.ai/v1'
  };

  const defaultModels = {
    openai: 'gpt-4o',
    ollama: 'llama3',
    grok: 'grok-1'
  };

  const handleProviderChange = (provider: ApiProvider) => {
    setSelectedProvider(provider);
    setNewProfile({
      ...newProfile,
      provider,
      baseUrl: defaultBaseUrls[provider],
      model: defaultModels[provider]
    });
  };

  const handleAddProfile = () => {
    if (!newProfile.name) {
      toast({
        title: 'Missing information',
        description: 'Please provide a name for the configuration profile.',
        variant: 'destructive'
      });
      return;
    }

    const id = `profile-${Date.now()}`;
    const profileToAdd = { ...newProfile, id };
    
    setConfigProfiles([...configProfiles, profileToAdd]);
    setNewProfile({
      id: '',
      name: '',
      provider: 'openai',
      baseUrl: defaultBaseUrls['openai'],
      apiKey: '',
      model: defaultModels['openai'],
      isActive: false
    });
    setShowAddProfile(false);
    
    toast({
      title: 'Profile added',
      description: `Configuration profile "${profileToAdd.name}" has been added.`,
    });
  };

  const handleEditProfile = (profile: ConfigProfile) => {
    setEditingProfileId(profile.id);
    setNewProfile(profile);
  };

  const handleUpdateProfile = () => {
    const updatedProfiles = configProfiles.map(profile => 
      profile.id === editingProfileId ? newProfile : profile
    );
    
    setConfigProfiles(updatedProfiles);
    setEditingProfileId(null);
    setNewProfile({
      id: '',
      name: '',
      provider: 'openai',
      baseUrl: defaultBaseUrls['openai'],
      apiKey: '',
      model: defaultModels['openai'],
      isActive: false
    });
    
    toast({
      title: 'Profile updated',
      description: `Configuration profile "${newProfile.name}" has been updated.`,
    });
  };

  const handleDeleteProfile = (id: string) => {
    const profileName = configProfiles.find(p => p.id === id)?.name;
    setConfigProfiles(configProfiles.filter(profile => profile.id !== id));
    
    toast({
      title: 'Profile deleted',
      description: `Configuration profile "${profileName}" has been deleted.`,
    });
  };

  const handleSetActiveProfile = (id: string) => {
    const updatedProfiles = configProfiles.map(profile => ({
      ...profile,
      isActive: profile.id === id
    }));
    
    setConfigProfiles(updatedProfiles);
    
    const activeName = updatedProfiles.find(p => p.id === id)?.name;
    toast({
      title: 'Active profile changed',
      description: `"${activeName}" is now the active configuration.`,
    });
  };

  const handleSaveSettings = (settingsType: string) => {
    setSaving(true);
    
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
          <TabsTrigger value="llm">LLM Providers</TabsTrigger>
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
        
        <TabsContent value="llm" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LLM Provider Configuration</CardTitle>
              <CardDescription>
                Configure API providers and models for the chat interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Configuration Profiles</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddProfile(!showAddProfile)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Profile
                  </Button>
                </div>
                
                {configProfiles.length > 0 ? (
                  <div className="space-y-3">
                    {configProfiles.map(profile => (
                      <div 
                        key={profile.id} 
                        className={`flex items-center justify-between p-3 border rounded-md ${
                          profile.isActive ? 'bg-primary/10 border-primary/30' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {profile.name} 
                            {profile.isActive && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {providerOptions.find(p => p.value === profile.provider)?.label} | {profile.model}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!profile.isActive && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSetActiveProfile(profile.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProfile(profile.id)}
                            disabled={profile.isActive}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No configuration profiles. Add one to get started.
                  </div>
                )}
                
                {(showAddProfile || editingProfileId) && (
                  <div className="border rounded-md p-4 mt-4 space-y-4 bg-secondary/10">
                    <h4 className="font-medium">
                      {editingProfileId ? 'Edit Profile' : 'New Configuration Profile'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profile-name">Profile Name</Label>
                          <Input 
                            id="profile-name" 
                            placeholder="e.g., OpenAI GPT-4o"
                            value={newProfile.name}
                            onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="api-provider">API Provider</Label>
                          <Select 
                            value={newProfile.provider}
                            onValueChange={(value) => handleProviderChange(value as ApiProvider)}
                          >
                            <SelectTrigger id="api-provider">
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {providerOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="base-url">Base URL</Label>
                          <Input 
                            id="base-url" 
                            placeholder="API endpoint base URL"
                            value={newProfile.baseUrl}
                            onChange={(e) => setNewProfile({...newProfile, baseUrl: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="api-key">API Key</Label>
                          <Input 
                            id="api-key" 
                            type="password"
                            placeholder="Your API key"
                            value={newProfile.apiKey}
                            onChange={(e) => setNewProfile({...newProfile, apiKey: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="model">Model</Label>
                          <Input 
                            id="model" 
                            placeholder="e.g., gpt-4o, llama3"
                            value={newProfile.model}
                            onChange={(e) => setNewProfile({...newProfile, model: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddProfile(false);
                            setEditingProfileId(null);
                            setNewProfile({
                              id: '',
                              name: '',
                              provider: 'openai',
                              baseUrl: defaultBaseUrls['openai'],
                              apiKey: '',
                              model: defaultModels['openai'],
                              isActive: false
                            });
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={editingProfileId ? handleUpdateProfile : handleAddProfile}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {editingProfileId ? 'Update' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  Save different API configurations to quickly switch between providers and settings.
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Additional Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Streaming</Label>
                      <p className="text-sm text-muted-foreground">
                        Stream responses from the LLM in real-time
                      </p>
                    </div>
                    <Switch 
                      checked={true}
                      onCheckedChange={() => {}}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Show detailed logs and debug information
                      </p>
                    </div>
                    <Switch 
                      checked={false}
                      onCheckedChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('LLM Provider')}
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
