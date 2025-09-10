import { Router } from "express";
import User from "../models/user.js";
import authMiddleware from "../auth/auth.js";
import axios from "axios";

const router = Router();
const ALPHA = process.env.JS_SERVER_ONE;
const BETA = process.env.JS_SERVER_TWO;

const validateURL = async (url) => {
    try {
        const res = await axios.get(`https://${url}`);
        return Math.floor(res.status / 100) === 2;
    } catch(err) {
        console.log(err);
        return false;
    }
}

// checked
router.put('/add-url', authMiddleware, async (req, res) => {
    try {
        let { userId, urlAddress, duration } = req.body;
        duration = duration <= 0 || duration === undefined ? 5 : duration;
        const isValidURL = await validateURL(urlAddress);

        if(!isValidURL) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const existing = user.urls.find(url => url.address === urlAddress) | [];
        if(existing.length) {
            return res.status(400).json({ error: "URL already exists"});
        }

        await User.updateOne(
            { _id: userId },
            { $push: { urls: { address: urlAddress, pingFrequency: duration } } }
        );
        axios.post(`https://kma-${user.worker}-server.nixquest.live/api/${user.worker}/edit-process`, {});
        return res.status(200).json({ message: "URL added successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// checked
router.get('/get-urls', authMiddleware, async (req, res) => {
    try {
        const { id } = req.query;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        axios.post(`https://kma-${user.worker}-server.nixquest.live/api/${user.worker}/edit-process`, {});
        return res.status(200).json({ urls: user.urls });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})


router.put('/edit-url', authMiddleware, async (req, res) => {
    const { userId, urlIndex, urlAddress, duration } = req.body;

    try {
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isValidURL = await validateURL(urlAddress);

        if(!isValidURL) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const existing = user.urls.find(url => url.address === urlAddress) | [];
        if(existing.length) {
            return res.status(400).json({ error: "URL already exists"});
        }

        user.urls[urlIndex] = {
            address: urlAddress,
            pingFrequency: duration,
        }
        await user.save();
        axios.post(`https://kma-${user.worker}-server.nixquest.live/api/${user.worker}/edit-process`, {});

        return res.status(200).json({ message: "URL updated successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

// checked
router.delete('/delete-url/', authMiddleware, async (req, res) => {
    try {
        const { id, url } = req.body;
        const user = await User.findById(id);

        if(!user) return res.status(404).json({ error: "User not found" });

        if(!user.urls.length) return res.status(404).json({ error: "User has zero urls" });

        const existing = user.urls.find(curUrl => curUrl.address === url) | [];

        if(existing.length) return res.status(404).json({ error: "URL doesn't exists" });

        user.urls = user.urls.filter(curUrl => curUrl.address !== url);

        await user.save();
        axios.post(`https://kma-${user.worker}-server.nixquest.live/api/${user.worker}/edit-process`, {});
        return res.status(200).json({ message: "URL deleted successfully" });
    } catch(err) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

export default router;