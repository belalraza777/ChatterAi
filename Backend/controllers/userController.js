import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Invalid email or password"
        });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(401).json({
            success: false,
            error: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { email: user.email, username: user.username, _id: user._id },
        process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true, });

    return res.status(200).json({
        success: true,
        data: {
            token,
            email: user.email,
            username: user.username
        }
    });
};

// Signup user
export const signupUser = async (req, res) => {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: "Email already registered"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hash });
    await user.save();

    const token = jwt.sign(
        { email: user.email, username: user.username, _id: user._id },
        process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true, });

    return res.status(201).json({
        success: true,
        data: {
            token,
            email: user.email,
            username: user.username
        }
    });
};

// Logout user
export const logoutUser = (req, res) => {
    res.clearCookie("token",{
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({
        success: true,
        data: "Logged out successfully"
    });
};

// check user Login
export const checkUserLogin = (req, res) => {
    const token = req.cookies?.token;

    // No token → Unauthorized
    if (!token) {
        return res.sendStatus(401);
    }

    // Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(401); // Invalid or expired token
        }
        // Valid token → OK
        res.status(200).json({
            authenticated: true,
            user: decoded
        });
    });
};
