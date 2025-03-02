
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Simple AI response generation logic (you can replace with actual API call)
    const generateAIResponse = (input: string) => {
      const responses = [
        "I can help you order from your favorite food platform!",
        "Would you like to order from Foodpanda, GrabFood, or ShopeeFood?",
        "What kind of food are you in the mood for today?",
        "I'd recommend trying the new restaurant that just opened on GrabFood.",
        "That's a great choice! Would you like to proceed with your order?"
      ];
      
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        source: Math.random() > 0.5 ? "Foodpanda" : "GrabFood",
      };
    };

    // Generate a response
    const aiResponse = generateAIResponse(message);
    
    // Simulate a delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 500));

    return new Response(JSON.stringify({ 
      success: true, 
      message: aiResponse.text,
      source: aiResponse.source
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
