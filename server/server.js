// libraries
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// configuration
import connectDB from './config/db.js'
dotenv.config();

// routes import
import userRoutes from './routes/user.js';
import urlRoutes from './routes/url.js';

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
const allowedOrigins = [
    'http://localhost:3000',
]

const corsOption = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.split(',').includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors()); // add corsOptions on deployment
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/user', userRoutes);
app.use('/api/url', urlRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
})