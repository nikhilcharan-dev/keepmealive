import { Router } from "express";
import User from "../models/user.js";
import authMiddleware from "../auth/auth.js";
import axios from "axios";
import redis from "../config/redis.js";

const router = Router();

const validateURL = async (url) => {
    try {
        const res = await axios.get(`https://${url}`);
        return Math.floor(res.status / 100) === 2;
    } catch(err) {
        return false;
    }
}

router.post('/set-duration', authMiddleware, async (req, res) => {
    try {
        const { id, duration } = req.body;
        const user = await User.findById(id);
        const nextPingAt = new Date(Date.now() + duration * 60 * 1000);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(duration < 1 || duration > 60) {
            return res.status(400).json({ error: "Invalid duration range" });
        }
        user.pingRange = duration;
        user.nextPingAt = nextPingAt;

        const cacheKey = `user:${id}`;
        await redis.set(cacheKey, JSON.stringify({
            ...user.toObject(),
            pingRange: duration,
        }), 'EX', 86400); // Cache for 24 hours

        await user.save();

        res.status(200).json({ message: 'Duration updated successfully' });
    } catch(err) {
        return res.status(500).json({ error: 'Internal server error' });
    }

})

router.put('/add-url', authMiddleware, async (req, res) => {
    try {
        const { id, url } = req.body;
        const isValidURL = await validateURL(url);

        if(!isValidURL) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if(user.urls.includes(url)) {
            return res.status(400).json({ error: "URL already exists"});
        }

        user.urls.push(url);
        await user.save();
        return res.status(200).json({ message: "URL added successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/get-urls', authMiddleware, async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id)
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ urls: user.urls });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/delete-url/:url', authMiddleware, async (req, res) => {
    try {
        const { id, url } = req.query;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.urls = user.urls.filter(item => item.url !== url);
        await user.save();
        return res.status(200).json({ message: "URL deleted successfully" });
    } catch(err) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

export default router;