
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Centralized CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NLU and Intent Classification
const identifyIntent = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes("recommend") || message.includes("suggestion") || message.includes("cadangan") || message.includes("syorkan")) {
    return "recommendation";
  } else if (message.includes("order") || message.includes("buy") || message.includes("pesan") || message.includes("beli")) {
    return "order";
  } else if (message.includes("status") || message.includes("track") || message.includes("where") || message.includes("status pesanan") || message.includes("jejak")) {
    return "track";
  } else if (message.includes("cancel") || message.includes("batal")) {
    return "cancel";
  } else if (message.includes("platform") || message.includes("service") || message.includes("perkhidmatan")) {
    return "platform";
  } else if (message.includes("hello") || message.includes("hi") || message.includes("halo") || message.includes("hai")) {
    return "greeting";
  }
  
  return "general";
};

// Food Recommendation Agent
const generateRecommendation = (message: string): { text: string, source: string } => {
  const malaysianFoods = [
    { name: "Nasi Lemak", platform: "GrabFood", rating: 4.8 },
    { name: "Char Kway Teow", platform: "Foodpanda", rating: 4.6 },
    { name: "Roti Canai", platform: "ShopeeFood", rating: 4.7 },
    { name: "Satay", platform: "GrabFood", rating: 4.5 },
    { name: "Laksa", platform: "Foodpanda", rating: 4.9 }
  ];
  
  const randomFood = malaysianFoods[Math.floor(Math.random() * malaysianFoods.length)];
  
  return {
    text: `Based on your preferences, I recommend trying ${randomFood.name}. It's currently rated ${randomFood.rating}/5 and available on ${randomFood.platform}.`,
    source: randomFood.platform
  };
};

// Order Management Agent
const handleOrderIntent = (message: string): { text: string, source: string } => {
  const platforms = ["GrabFood", "Foodpanda", "ShopeeFood"];
  const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
  
  return {
    text: `I can help you place an order. Would you like to order from ${randomPlatform} or specify another platform? Just tell me what you'd like to order.`,
    source: randomPlatform
  };
};

// Track Order Agent
const handleTrackIntent = (): { text: string, source: string } => {
  const statuses = [
    "Your order is being prepared by the restaurant.",
    "A rider has picked up your order and is on the way.",
    "Your order will arrive in approximately 15 minutes."
  ];
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const platforms = ["GrabFood", "Foodpanda", "ShopeeFood"];
  const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
  
  return {
    text: randomStatus,
    source: randomPlatform
  };
};

// Multi-platform Integration Agent
const handlePlatformIntent = (): { text: string, source: string } => {
  return {
    text: "I can help you order food from multiple platforms including GrabFood, Foodpanda, and ShopeeFood. Which one would you prefer to use?",
    source: "Multi-platform"
  };
};

// Bilingual Support (Simple implementation)
const translateResponse = (text: string, preferBahasa: boolean): string => {
  if (!preferBahasa) return text;
  
  // Simple translation map (in a real implementation, use a proper translation service)
  const translations: Record<string, string> = {
    "I can help you place an order": "Saya boleh membantu anda membuat pesanan",
    "Would you like to order from": "Adakah anda ingin memesan dari",
    "or specify another platform": "atau tentukan platform lain",
    "Just tell me what you'd like to order": "Beritahu saya apa yang anda ingin pesan",
    "Your order is being prepared": "Pesanan anda sedang disediakan",
    "A rider has picked up your order": "Penghantar telah mengambil pesanan anda",
    "Your order will arrive in approximately": "Pesanan anda akan tiba dalam kira-kira",
    "minutes": "minit",
    "I can help you order food from multiple platforms": "Saya boleh membantu anda memesan makanan dari pelbagai platform",
    "Which one would you prefer to use": "Yang mana satu anda lebih suka gunakan",
    "Based on your preferences, I recommend trying": "Berdasarkan pilihan anda, saya cadangkan untuk mencuba",
    "It's currently rated": "Ia kini dinilai",
    "and available on": "dan boleh didapati di",
    "Hello! I'm your AI assistant": "Halo! Saya ialah pembantu AI anda",
    "How can I help you order food today": "Bagaimana saya boleh membantu anda memesan makanan hari ini",
    "I'm not sure I understand": "Saya tidak pasti saya faham",
    "Are you looking for food recommendations": "Adakah anda mencari cadangan makanan",
    "or would you like to place an order": "atau ingin membuat pesanan"
  };
  
  let translatedText = text;
  for (const [english, bahasa] of Object.entries(translations)) {
    translatedText = translatedText.replace(new RegExp(english, 'g'), bahasa);
  }
  
  return translatedText;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = "english" } = await req.json();
    const preferBahasa = language.toLowerCase() === "bahasa" || language.toLowerCase() === "malay";
    
    console.log(`Received message: "${message}", language preference: ${language}`);
    
    // Identify user intent
    const intent = identifyIntent(message);
    console.log(`Identified intent: ${intent}`);
    
    let response: { text: string, source: string };
    
    // Route to appropriate agent based on intent
    switch (intent) {
      case "recommendation":
        response = generateRecommendation(message);
        break;
      case "order":
        response = handleOrderIntent(message);
        break;
      case "track":
        response = handleTrackIntent();
        break;
      case "platform":
        response = handlePlatformIntent();
        break;
      case "greeting":
        response = {
          text: "Hello! I'm your AI assistant. How can I help you order food today?",
          source: "AI Assistant"
        };
        break;
      default:
        response = {
          text: "I'm not sure I understand. Are you looking for food recommendations, or would you like to place an order?",
          source: "AI Assistant"
        };
    }
    
    // Apply language preference
    response.text = translateResponse(response.text, preferBahasa);
    
    console.log(`Responding with: "${response.text}" from source: ${response.source}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: response.text,
      source: response.source
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
