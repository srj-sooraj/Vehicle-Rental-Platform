import { GoogleGenerativeAI } from "@google/generative-ai";
import Vehicle from "../models/Vehicle.js";

export async function geminiChat(req, res) {
  try {
    const { message } = req.body;
    
    // 1. Fetch data from DB
    const vehicles = await Vehicle.find().limit(10);
    const vehicleList = vehicles.length > 0 
      ? vehicles.map(v => `${v.name} (${v.type}) - ₹${v.pricePerDay}/day`).join("\n")
      : "No vehicles currently available.";

    // 2. Initialize GenAI inside the request
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 3. Use the most stable model name
    const model = genAI.getGenerativeModel({
       model: "gemini-2.5-flash",
       generationConfig: { responseMimeType: "application/json" }
      });

   const prompt = `
  You are an AI assistant for a vehicle rental platform.
  Available vehicles: ${vehicleList}
  User question: ${message}

  Return your response in JSON format:
  {
    "recommendation": "A friendly summary message",
    "vehicles": ["Name of vehicle 1", "Name of vehicle 2"]
  }
`;

    // 4. Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Gemini Error Details:", error);
    res.status(500).json({ error: error.message });
  }
}