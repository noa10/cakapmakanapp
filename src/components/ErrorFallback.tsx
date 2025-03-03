import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Error details:</p>
          <pre className="bg-muted p-3 rounded-md overflow-auto">
            {error.message}
          </pre>
        </div>
        <Button 
          onClick={resetErrorBoundary}
          className="w-full"
        >
          Try again
        </Button>
      </Card>
    </div>
  );
}; 