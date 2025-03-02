// Simple test file to check requesty.ai communication
// You can run this with node to test the API key and connection

async function testRequestyApi() {
  try {
    const apiKey = process.env.VITE_REQUESTY_API_KEY || 
      "sk-hRDsD6wARtyxAngfhNdxg/oLV8DzNM8zX/FKNXHv7qnuw1irdqGo1WOzdLDdDZ7ahqyRI4Qw6fH/34F+XVSjEPMBMJq1ckl6XYIP5Rv9ZQg=";
    
    console.log('Testing Requesty.ai API with key:', apiKey.substring(0, 10) + '...');
    
    // Use the correct endpoint according to Requesty.ai documentation
    const url = "https://router.requesty.ai/v1/chat/completions";
    
    console.log(`\nTesting URL: ${url}`);
    
    // Format request according to OpenAI-compatible API
    // Based on documentation: model format is "provider/model-name"
    const requestBody = {
      model: "openai/gpt-4o", // Using the model format shown in documentation
      messages: [
        {
          role: "system",
          content: "You are a friendly food ordering assistant. You help users order food from restaurants."
        },
        {
          role: "user",
          content: "Hello, can you recommend a good restaurant?"
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('SUCCESS! Response:', JSON.stringify(data, null, 2));
      
      // Extract the actual message from the OpenAI-compatible format
      const responseMessage = data.choices?.[0]?.message?.content;
      if (responseMessage) {
        console.log('\nExtracted message:', responseMessage);
      }
    } else {
      const errorText = await response.text();
      console.error(`Error ${response.status}:`, errorText);
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testRequestyApi(); 