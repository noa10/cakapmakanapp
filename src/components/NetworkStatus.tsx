import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { checkRequestyAvailability } from '@/utils/network-checker';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check API availability on mount and when online status changes
    const checkApi = async () => {
      if (isOnline) {
        const available = await checkRequestyAvailability();
        setIsApiAvailable(available);
      }
    };
    
    checkApi();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);
  
  if (!isOnline) {
    return (
      <div className="flex items-center text-xs text-destructive gap-1 px-2 py-1 rounded-full bg-destructive/10">
        <WifiOff className="h-3 w-3" />
        <span>Offline</span>
      </div>
    );
  }
  
  if (!isApiAvailable) {
    return (
      <div className="flex items-center text-xs text-amber-500 gap-1 px-2 py-1 rounded-full bg-amber-500/10">
        <Wifi className="h-3 w-3" />
        <span>API Unavailable</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-xs text-green-500 gap-1 px-2 py-1 rounded-full bg-green-500/10">
      <Wifi className="h-3 w-3" />
      <span>Connected</span>
    </div>
  );
};

export default NetworkStatus;