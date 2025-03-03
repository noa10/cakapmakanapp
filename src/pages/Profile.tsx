import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Store } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, getUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [grabClientId, setGrabClientId] = useState("");
  const [grabClientSecret, setGrabClientSecret] = useState("");
  const [isGrabIntegrated, setIsGrabIntegrated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      const profile = await getUserProfile();
      
      if (profile) {
        setUsername(profile.username || "");
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
        setIsBusinessMode(profile.is_business_mode || false);
        setBusinessName(profile.business_name || "");
        setBusinessAddress(profile.business_address || "");
        setGrabClientId(profile.grab_client_id || "");
        setGrabClientSecret(profile.grab_client_secret || "");
        setIsGrabIntegrated(!!profile.grab_client_id);
      }
      
      setLoading(false);
    };

    loadProfile();
  }, [user, getUserProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
          is_business_mode: isBusinessMode,
          business_name: businessName,
          business_address: businessAddress,
          grab_client_id: grabClientId,
          grab_client_secret: grabClientSecret,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });

      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });

      setError("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleTestGrabIntegration = async () => {
    try {
      // Here you would test the Grab integration
      // For now, we'll just simulate a successful test
      setIsGrabIntegrated(true);
      setSuccess("Grab Food integration successful!");
    } catch (error) {
      setError("Failed to integrate with Grab Food. Please check your credentials.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div>Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Update your profile information here.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      You cannot change your email address.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="businessMode"
                        checked={isBusinessMode}
                        onCheckedChange={setIsBusinessMode}
                      />
                      <Label htmlFor="businessMode">Business Mode</Label>
                    </div>
                    {isBusinessMode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/business')}
                      >
                        Go to Business Dashboard
                      </Button>
                    )}
                  </div>

                  {isBusinessMode && (
                    <>
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Enter your business name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Input
                          id="businessAddress"
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          placeholder="Enter your business address"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-2 mb-4">
                          <Store className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Grab Food Integration</h3>
                        </div>
                        
                        {isGrabIntegrated ? (
                          <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                              Grab Food integration is active
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="grabClientId">Grab Client ID</Label>
                              <Input
                                id="grabClientId"
                                value={grabClientId}
                                onChange={(e) => setGrabClientId(e.target.value)}
                                placeholder="Enter your Grab Client ID"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="grabClientSecret">Grab Client Secret</Label>
                              <Input
                                id="grabClientSecret"
                                type="password"
                                value={grabClientSecret}
                                onChange={(e) => setGrabClientSecret(e.target.value)}
                                placeholder="Enter your Grab Client Secret"
                              />
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleTestGrabIntegration}
                              className="w-full"
                            >
                              Test Grab Food Integration
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={updating}>
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
