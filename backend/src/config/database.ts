import mongoose from "mongoose";
import config from "./env"

const connectDb = async() => {
    try{
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

        //Listen for connection events for debugging
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });
    }catch(err){
        console.error(`Error connecting to MongoDB: ${err}`);
        process.exit(1);
    }
};
export default connectDb