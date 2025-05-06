import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri, {});
        console.log('MongoDB connected successfully');
    } catch(err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

export default connectDB;
