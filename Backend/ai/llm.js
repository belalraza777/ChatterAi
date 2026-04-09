import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
// Reuse the shared system prompt from the utility module.
import systemPrompt from "../util/system_prompt.js";

//Groq client setup - uses GROQ_API_KEY or falls back to generic API_KEY for flexibility.
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || process.env.API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
});

// Helper functions to build the message payload for the Groq API.
//Build the message history in the format expected by the Groq API, filtering out any malformed entries.
const buildHistoryMessages = (history) => {
    if (!Array.isArray(history)) {
        return [];
    }
    return history
        .filter((msg) => msg?.role && typeof msg?.content === "string")
        .map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));
};

// Build the current user message, including optional image data as a base64 string.
const buildCurrentUserMessage = (userMessage, imageFile) => {
    const trimmedMessage = userMessage?.trim() || "";

    if (!imageFile) {
        return { role: "user", content: trimmedMessage };
    }

    const imageDataUrl = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

    // Add a short fallback prompt when the user sends image-only input.
    return {
        role: "user",
        content: [
            {
                type: "text",
                text: trimmedMessage || "Please describe this image.",
            },
            {
                type: "image_url",
                image_url: {
                    url: imageDataUrl,
                },
            },
        ],
    };
};

//Main function to call the Groq API with the constructed message payload.
export async function apiCall({ history = [], userMessage = "", imageFile = null, model } = {}) {
    if (!model) {
        throw new Error("Model is required.");
    }

    try {
        const response = await groq.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                ...buildHistoryMessages(history),
                buildCurrentUserMessage(userMessage, imageFile),
            ],
            stream: false,
            temperature: 1,
        });

        return response.choices[0].message.content || "Hmm, I didn't get that. Can you repeat?";
    } catch (err) {
        console.log("Groq API error:", err);
        return "Oops, something went wrong. Try again later!"; // fallback
    }
}

