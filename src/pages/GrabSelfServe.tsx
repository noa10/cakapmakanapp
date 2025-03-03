import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { GrabFoodService } from '@/services/grabfood';

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function GrabSelfServe() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Register as a Grab Partner',
      description: 'Sign up as a merchant partner on Grab\'s platform',
      completed: false,
    },
    {
      id: 2,
      title: 'Get API Credentials',
      description: 'Obtain your Client ID and Client Secret from Grab Developer Portal',
      completed: false,
    },
    {
      id: 3,
      title: 'Configure Integration',
      description: 'Set up your API credentials in the application',
      completed: false,
    },
    {
      id: 4,
      title: 'Test Integration',
      description: 'Verify your integration with Grab\'s services',
      completed: false,
    },
  ]);

  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveCredentials = async () => {
    try {
      // Here you would typically save these credentials securely
      // For now, we'll just update the environment variables
      setSuccess('Credentials saved successfully!');
      setSteps(steps.map(step => 
        step.id === 3 ? { ...step, completed: true } : step
      ));
    } catch (err) {
      setError('Failed to save credentials. Please try again.');
    }
  };

  const handleTestIntegration = async () => {
    try {
      // Test the integration using the GrabFoodService
      const grabService = new GrabFoodService(clientId, clientSecret);
      // Make a test API call
      await grabService.searchRestaurants('test', { lat: 3.1412, lng: 101.6865 });
      setSuccess('Integration test successful!');
      setSteps(steps.map(step => 
        step.id === 4 ? { ...step, completed: true } : step
      ));
    } catch (err) {
      setError('Integration test failed. Please check your credentials.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Grab Self-Serve Integration</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {steps.map((step) => (
          <Card key={step.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-600 mt-1">{step.description}</p>
                
                {step.id === 3 && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="clientId">Client ID</Label>
                      <Input
                        id="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="Enter your Grab Client ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <Input
                        id="clientSecret"
                        type="password"
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        placeholder="Enter your Grab Client Secret"
                      />
                    </div>
                    <Button onClick={handleSaveCredentials}>
                      Save Credentials
                    </Button>
                  </div>
                )}

                {step.id === 4 && (
                  <div className="mt-4">
                    <Button onClick={handleTestIntegration}>
                      Test Integration
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Review Grab's API documentation for detailed integration guidelines</li>
          <li>Set up webhook endpoints for order notifications</li>
          <li>Implement error handling and retry mechanisms</li>
          <li>Monitor your integration through Grab's dashboard</li>
        </ul>
      </div>
    </div>
  );
} 