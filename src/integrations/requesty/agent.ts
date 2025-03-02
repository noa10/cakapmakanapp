import { RequestyResponse } from "./index";

// Define the tool types that our agent can use
export type Tool = {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  function: (args: any) => Promise<any>;
};

// Define the agent state
export type AgentState = {
  conversationHistory: {
    role: "system" | "user" | "assistant" | "function";
    content: string;
    name?: string;
  }[];
  tools: Tool[];
};

// Create a new agent state with initial system message
export function createAgentState(): AgentState {
  return {
    conversationHistory: [
      {
        role: "system",
        content: `You are an intelligent food ordering assistant that helps users order food from various platforms like GrabFood, Foodpanda, and ShopeeFood in Malaysia. 
        You can recommend restaurants, dishes, and help with placing and tracking orders.
        When users ask about food recommendations, try to provide specific suggestions based on Malaysian cuisine.
        You can understand and respond in both English and Bahasa Malaysia.
        Always be helpful, friendly, and concise in your responses.`
      }
    ],
    tools: [] // Will be populated with tools on initialization
  };
}

// The agent class that encapsulates all agent functionality
export class RequestyAgent {
  private state: AgentState;
  private apiKey: string;

  constructor(apiKey: string, initialState?: AgentState) {
    this.apiKey = apiKey;
    this.state = initialState || createAgentState();
  }

  // Register tools that the agent can use
  registerTool(tool: Tool): void {
    this.state.tools.push(tool);
  }

  // Register multiple tools at once
  registerTools(tools: Tool[]): void {
    this.state.tools.push(...tools);
  }

  // Process user input and generate a response
  async processMessage(message: string, language: string = 'english'): Promise<RequestyResponse> {
    // Add user message to conversation history
    this.state.conversationHistory.push({
      role: "user",
      content: message
    });

    try {
      // Create the API request body
      const requestBody = this.createRequestBody(language);
      
      // Call the Requesty.ai API
      const response = await this.callRequestyAPI(requestBody);
      
      // Extract the assistant's message
      const assistantMessage = response.choices?.[0]?.message?.content || 
        "Sorry, I couldn't process your request at this time.";
      
      // Add assistant response to conversation history
      this.state.conversationHistory.push({
        role: "assistant",
        content: assistantMessage
      });
      
      return {
        message: assistantMessage,
        source: "Requesty AI Agent"
      };
    } catch (error) {
      console.error("Error in agent processing:", error);
      throw error;
    }
  }

  // Create the request body for the API call
  private createRequestBody(language: string) {
    // Format tools for the API request if tools exist
    const formattedTools = this.state.tools.length > 0 ? 
      this.state.tools.map(tool => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      })) : undefined;

    // Create the final request body
    return {
      model: "deepinfra/deepseek-ai/DeepSeek-R1",
      messages: this.state.conversationHistory,
      tools: formattedTools,
      temperature: 0.7,
      max_tokens: 500
    };
  }

  // Call the Requesty.ai API
  private async callRequestyAPI(requestBody: any): Promise<any> {
    // Use the proxy URL instead of direct API URL
    const url = "/requesty-api/v1/chat/completions";
    
    console.log("Calling Requesty API with URL:", url);
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    try {
      // Create API call with proper headers
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("Requesty API response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Requesty API error response:", errorText);
        throw new Error(`Requesty API error: ${response.status} - ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Requesty API response data:", JSON.stringify(data, null, 2));
      
      return data;
    } catch (error: any) {
      console.error("Detailed error in callRequestyAPI:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause
      });
      throw error;
    }
  }

  // Get the current conversation history
  getConversationHistory() {
    return this.state.conversationHistory;
  }

  // Reset the conversation history but keep the system prompt
  resetConversation() {
    const systemMessage = this.state.conversationHistory[0];
    this.state.conversationHistory = [systemMessage];
  }
}

// Create predefined tools for the food ordering agent
export const createFoodOrderingTools = (): Tool[] => {
  return [
    {
      name: "get_restaurant_recommendations",
      description: "Get restaurant recommendations based on cuisine or location",
      parameters: {
        type: "object",
        properties: {
          cuisine: {
            type: "string",
            description: "The type of cuisine (e.g., Malay, Chinese, Indian, Western)"
          },
          location: {
            type: "string",
            description: "The area or neighborhood"
          },
          price_range: {
            type: "string",
            description: "Price range (budget, moderate, expensive)"
          }
        },
        required: ["cuisine"]
      },
      function: async (args) => {
        // Mock implementation - in a real app this would call an actual API
        const restaurants = [
          { name: "Nasi Kandar Pelita", cuisine: "Malay", price_range: "budget", rating: 4.2 },
          { name: "Sushi King", cuisine: "Japanese", price_range: "moderate", rating: 4.0 },
          { name: "Restoran Sangeetha", cuisine: "Indian", price_range: "moderate", rating: 4.5 },
          { name: "MyBurgerLab", cuisine: "Western", price_range: "moderate", rating: 4.3 },
          { name: "Din Tai Fung", cuisine: "Chinese", price_range: "expensive", rating: 4.7 }
        ];
        
        // Filter by cuisine if provided
        let filtered = restaurants;
        if (args.cuisine) {
          const lowerCuisine = args.cuisine.toLowerCase();
          filtered = restaurants.filter(r => 
            r.cuisine.toLowerCase().includes(lowerCuisine));
        }
        
        // Filter by price range if provided
        if (args.price_range) {
          filtered = filtered.filter(r => 
            r.price_range === args.price_range);
        }
        
        return {
          restaurants: filtered.map(r => ({
            name: r.name,
            cuisine: r.cuisine,
            rating: r.rating,
            price_range: r.price_range
          }))
        };
      }
    },
    {
      name: "check_food_delivery_platforms",
      description: "Check which food delivery platforms are available for a given restaurant",
      parameters: {
        type: "object",
        properties: {
          restaurant: {
            type: "string",
            description: "The name of the restaurant"
          }
        },
        required: ["restaurant"]
      },
      function: async (args) => {
        // Mock implementation
        const platforms = {
          "Nasi Kandar Pelita": ["GrabFood", "Foodpanda"],
          "Sushi King": ["GrabFood", "Foodpanda", "ShopeeFood"],
          "Restoran Sangeetha": ["GrabFood"],
          "MyBurgerLab": ["GrabFood", "Foodpanda", "ShopeeFood"],
          "Din Tai Fung": ["GrabFood", "Foodpanda"]
        };
        
        // Return available platforms or default
        return {
          platforms: platforms[args.restaurant] || ["GrabFood", "Foodpanda"]
        };
      }
    },
    {
      name: "track_order",
      description: "Track the status of a food delivery order",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "The order ID to track"
          },
          platform: {
            type: "string",
            description: "The food delivery platform (GrabFood, Foodpanda, ShopeeFood)"
          }
        },
        required: ["platform"]
      },
      function: async (args) => {
        // Mock implementation
        const statuses = [
          "Your order is being prepared by the restaurant.",
          "A driver has picked up your order and is on the way.",
          "Your order will arrive in approximately 10-15 minutes.",
          "Your order has been delivered. Enjoy your meal!"
        ];
        
        // Randomly select a status
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          status: randomStatus,
          estimated_delivery: "25-35 minutes",
          platform: args.platform
        };
      }
    }
  ];
};

// Hook for using the RequestyAgent
export function createAgent(apiKey: string): RequestyAgent {
  const agent = new RequestyAgent(apiKey);
  
  // Register tools
  agent.registerTools(createFoodOrderingTools());
  
  return agent;
} 