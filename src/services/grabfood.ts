import axios from 'axios';

interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class GrabFoodService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = 'https://api.grab.com/food/v1.1.3';
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<AccessToken>(
        'https://api.grab.com/oauth2/token',
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'food.order food.restaurant food.menu',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry time (subtract 5 minutes for safety margin)
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to obtain access token');
    }
  }

  private async makeAuthenticatedRequest<T>(
    method: 'get' | 'post',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const token = await this.getAccessToken();
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Grab-Id': this.clientId,
        },
        data,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh and retry once
        this.accessToken = null;
        this.tokenExpiry = null;
        return this.makeAuthenticatedRequest(method, endpoint, data);
      }
      throw error;
    }
  }

  async searchRestaurants(query: string, location: { lat: number; lng: number }) {
    try {
      return await this.makeAuthenticatedRequest('get', '/restaurants/search', {
        params: {
          q: query,
          lat: location.lat,
          lng: location.lng,
          limit: 20,
          offset: 0,
        },
      });
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  }

  async getRestaurantMenu(restaurantId: string) {
    try {
      return await this.makeAuthenticatedRequest('get', `/restaurants/${restaurantId}/menu`);
    } catch (error) {
      console.error('Error getting restaurant menu:', error);
      throw error;
    }
  }

  async placeOrder(orderData: {
    restaurant_id: string;
    items: Array<{
      item_id: string;
      quantity: number;
      options?: Array<{
        option_id: string;
        quantity: number;
      }>;
    }>;
    delivery_address: {
      street: string;
      city: string;
      postal_code: string;
      country: string;
    };
    customer_info: {
      name: string;
      phone: string;
      email?: string;
    };
  }) {
    try {
      return await this.makeAuthenticatedRequest('post', '/orders', orderData);
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      return await this.makeAuthenticatedRequest('get', `/orders/${orderId}`);
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }
} 