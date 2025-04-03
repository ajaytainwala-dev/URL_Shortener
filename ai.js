// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "details of bengaluru"
const prompt = "Analyze the URL 'https://www.bumbledry.com/' and determine if it is legitimate or malicious. Provide a yes or no answer with a brief explanation.";
const result = await model.generateContent(prompt);
console.log(result.response.text());
