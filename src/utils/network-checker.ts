/**
 * Utility to check network connectivity and API availability
 */

// Check if the browser is online
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Check if a specific API endpoint is reachable
export const checkApiAvailability = async (url: string): Promise<boolean> => {
  try {
    // Use a HEAD request to minimize data transfer
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache',
    });
    
    return response.ok;
  } catch (error) {
    console.error('API availability check failed:', error);
    return false;
  }
};

// Check specifically for Requesty.ai availability
export const checkRequestyAvailability = async (): Promise<boolean> => {
  // Note: We're just checking if the domain is reachable, not making an actual API call
  return await checkApiAvailability('https://router.requesty.ai/');
};

// Get a user-friendly error message based on network status
export const getNetworkErrorMessage = async (): Promise<string> => {
  if (!isOnline()) {
    return "You appear to be offline. Please check your internet connection.";
  }
  
  const isRequestyAvailable = await checkRequestyAvailability();
  if (!isRequestyAvailable) {
    return "Unable to reach the Requesty.ai service. The service might be down or blocked by your network.";
  }
  
  return "There was an error connecting to the service. Please try again later.";
};