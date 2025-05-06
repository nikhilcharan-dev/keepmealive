import { Router } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from "../config/redis.js";
import authMiddleware from "../auth/auth.js";

const router = Router();

router.post("/register", authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;

    const existingName = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if(existingName) return res.status(400).json({ error: "Username already exists" });
    if(existingEmail) return res.status(400).json({ error: "Email already exists" });

    const existingUsers = User.countDocuments();
    const allocatedWorker = existingUsers % 2 === 0 ? 'alpha' : 'beta';

    const hashedPassword = await bcrypt.hash(password, 10);
    const nextPingAt = new Date(Date.now() + 15 * 60 * 1000);
    try {
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            worker: allocatedWorker,
            pingRange: 15,
            nextPingAt: nextPingAt,
        })
        await newUser.save();

        const redisKey = `user:${allocatedWorker}:${newUser._id}`;
        await redis.set(redisKey, JSON.stringify({
            ...newUser.toObject(),
            password: undefined,
        }), 'EX', 86400); // Cache for 24 hours

        return res.status(201).json({ message: "User registered successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }

})

router.post("/login", authMiddleware, async (req, res) => {
    const { usernameOrEmail, password } = req.body();
    const isEmail = (str) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(str);
    };

    let user;
    if(isEmail(usernameOrEmail)) {
        user = await User.findOne({ email: usernameOrEmail });
    } else {
        user = await User.findOne({ username: usernameOrEmail });
    }

    if(!user) return res.status(400).json({ error: "Invalid username or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token, userData: user});
})

export default router;