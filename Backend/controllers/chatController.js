import User from '../models/userModel.js';
import ChatThread from '../models/threadModel.js';
import { apiCall } from "../util/api.js";

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
    const { userMessage } = req.body;

    const thread = await ChatThread.findById(threadId);
    if (!thread) {
        return res.status(404).json({
            success: false,
            error: "Thread not found"
        });
    }

    thread.messages.push({ role: "user", content: userMessage });
    await thread.save();

    const reply = await apiCall(thread.messages);

    thread.messages.push({ role: "assistant", content: reply });
    await thread.save();

    res.status(200).json({
        success: true,
        data: { reply }
    });
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
