// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyBVRCZKy7KjkqWWBtONjgzLDDbPmJCh9-o");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "check https://www.gyan-academy.in/ is malicious or not and give me only yes or no";
const result = await model.generateContent(prompt);
console.log(result.response.text());
