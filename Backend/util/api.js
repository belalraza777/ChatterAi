import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
import systemPrompt from "./system_prompt.js";

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL,
});


export async function apiCall(message) {
    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4.1",
            messages: [
                { role: "system", content: systemPrompt },
                ...message
            ],
            stream: false 
        });
        return response.choices[0].message.content || "Hmm, I didn't get that. Can you repeat?";
    } catch (err) {
        console.log("OpenAI API error:", err);
        return "Oops, something went wrong. Try again later!"; // fallback
    }
}

