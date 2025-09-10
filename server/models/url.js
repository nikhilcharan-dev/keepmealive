import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    status: String
})

export default UrlSchema;