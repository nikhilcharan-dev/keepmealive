import { Router } from "express";
import User from "../models/user.js";
import authMiddleware from "../auth/auth.js";
import axios from "axios";

const router = Router();

const validateURL = async (url) => {
    try {
        const res = await axios.get(`https://${url}`);
        return Math.floor(res.status / 100) === 2;
    } catch(err) {
        console.log(err);
        return false;
    }
}

router.post('/set-duration', authMiddleware, async (req, res) => {
    try {
        const { id, urlIndex, duration } = req.body;
        const user = await User.findById(id);

        const nextPingAt = new Date(Date.now() + duration * 60 * 1000);
        if(!user) return res.status(404).json({ error: "User not found" });

        if(duration < 5 || duration > 30) return res.status(400).json({ error: "Invalid duration range" });
        if(urlIndex >= user.urls?.length) return res.status(400).json({ error: "Invalid url index" });

        user.urls[urlIndex].pingFrequency = duration;

        await user.save();
        res.status(200).json({ message: 'Duration updated successfully' });
    } catch(err) {
        return res.status(500).json({ error: 'Internal server error' });
    }

})

router.put('/add-url', authMiddleware, async (req, res) => {
    try {
        let { userId, urlAddress, duration } = req.body;
        duration = duration === null ? 5 : duration;
        const isValidURL = await validateURL(urlAddress);

        if(!isValidURL) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const existing = user.urls.find(url => url.address === urlAddress);
        if(existing.length) {
            return res.status(400).json({ error: "URL already exists"});
        }

        await User.updateOne(
            { _id: userId },
            { $push: { urls: { address: urlAddress, pingFrequency: duration } } }
        );

        return res.status(200).json({ message: "URL added successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/get-urls', authMiddleware, async (req, res) => {
    try {
        const { id } = req.query;
        const user = await User.findById(id).lean();
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ urls: user.urls });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.put('/edit-url', authMiddleware, async (req, res) => {
    const { userId, urlIndex, url, oldUrl } = req.body;

    try {
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isValidURL = await validateURL(url);

        if(!isValidURL) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const existing = user.urls.find(url => url.address === urlAddress);
        if(existing.length) {
            return res.status(400).json({ error: "URL already exists"});
        }

        user.urls[urlIndex] = url;
        await user.save();

        return res.status(200).json({ message: "URL updated successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/delete-url/', authMiddleware, async (req, res) => {
    try {
        const { id, url } = req.body;
        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(!user.urls.length) return res.status(404).json({ error: "User has zero urls" });
        const existing = user.urls.find(curUrl => curUrl.address === url);
        console.log("got response 1", existing);
        if(!existing?.length) return res.status(404).json({ error: "URL doesn't exists" });
        console.log("got response 2")
        user.urls = user.urls.filter(item => item !== url);
        console.log("got response 3")
        await user.save();

        console.log("URL deleted successfully");
        return res.status(200).json({ message: "URL deleted successfully" });
    } catch(err) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

export default router;