import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const { MONGODB_URL } = process.env;
        await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;