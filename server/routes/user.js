import { Router } from 'express';
import User from '../models/user.js';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/users-count', async (req, res) => {
    try {
        const usersCount = await User.countDocuments({});
        const users = await User.find().lean();
        const urlsCount = users.map(user => user.urls.length).reduce((sum, cur) => sum + cur, 0);
        return res.status(200).json({
            usersCount,
            urlsCount,
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }
})

router.post("/register", async (req, res) => {
    try {
        const { username, email } = req.body;

        const existingName = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if(existingName) return res.status(400).json({ error: "Username already exists" });
        if(existingEmail) return res.status(400).json({ error: "Email already exists" });

        const existingUsers = await User.countDocuments();
        const allocatedWorker = existingUsers % 2 === 0 ? 'alpha' : 'beta';

        const newUser = new User({
            username,
            email,
            worker: allocatedWorker,
            urls: []
        })

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }

})

router.post("/login", async (req, res) => {
    const { usernameOrEmail } = req.body;
    const isEmail = (str) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(str);
    };

    try {
        let user;
        if(isEmail(usernameOrEmail)) {
            user = await User.findOne({ email: usernameOrEmail });
        } else {
            console.log(usernameOrEmail)
            user = await User.findOne({ username: usernameOrEmail });
        }

        if(!user) return res.status(400).json({ error: "Invalid username or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, userData: user});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }


})

export default router;