import User from '../models/userModel.js';
import ChatThread from '../models/threadModel.js';
import { apiCall } from "../ai/llm.js";
import { readFile, unlink } from "fs/promises";

// Get all threads of a user
export const getAllThreads = async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const threads = await ChatThread.find({ userId: user._id });

    res.status(200).json({
        success: true,
        data: threads,
        user: user
    });
};

// Create new thread
export const createThread = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({
            success: false,
            error: "Title is required",
        });
    }

    const user = await User.findOne({ email: req.user.email });

    const newThread = new ChatThread({
        title,
        userId: user._id,
    });

    const thread = await newThread.save();

    res.status(201).json({
        success: true,
        data: thread,
    });
};

// Show single thread
export const getThread = async (req, res) => {
    const { threadId } = req.params;
    const thread = await ChatThread.findById(threadId);

    if (thread) {
        res.status(200).json({
            success: true,
            data: thread
        });
    } else {
        res.status(404).json({
            success: false,
            error: "Thread not found"
        });
    }
};


// Start chat with a thread
export const sendMessage = async (req, res) => {
    const { threadId } = req.params;
    const { userMessage = "", model } = req.body;
    const uploadedImage = req.file || null;
    const trimmedMessage = userMessage.trim();

    try {
        const thread = await ChatThread.findById(threadId);
        if (!thread) {
            return res.status(404).json({
                success: false,
                error: "Thread not found"
            });
        }

        const historyMessages = thread.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        let imageFile = null;
        if (uploadedImage?.path) {
            // Read the uploaded file into memory only for the outbound model request.
            const imageBuffer = await readFile(uploadedImage.path);
            // Imagefile obj contain mimetype and buffer which is used to construct the base64 string for the LLM input. We keep the DB schema unchanged by not storing image-specific fields in our message documents.
            imageFile = {
                mimetype: uploadedImage.mimetype, // e.g., "image/png"
                buffer: imageBuffer,  // it store buffer of the image which is used to construct the base64 string for the LLM input, but we don't store the image in our DB.
            };
        }

        // Keep DB schema unchanged by storing text even when the user sends image-only input.
        thread.messages.push({
            role: "user",
            content: trimmedMessage || "[Image uploaded]",
        });
        await thread.save();

        const reply = await apiCall({
            history: historyMessages,
            userMessage: trimmedMessage,
            imageFile,
            model,
        });

        thread.messages.push({ role: "assistant", content: reply });
        await thread.save();

        return res.status(200).json({
            success: true,
            data: { reply }
        });
    } finally {
        if (uploadedImage?.path) {
            await unlink(uploadedImage.path).catch(() => undefined);
        }
    }
};

// Delete thread
export const deleteThread = async (req, res) => {
    const { threadId } = req.params;
    const thread = await ChatThread.findByIdAndDelete(threadId);

    if (thread) {
        return res.status(200).json({
            success: true,
            data: { thread }
        });
    } else {
        return res.status(404).json({
            success: false,
            error: "Thread not found"
        });
    }
};
