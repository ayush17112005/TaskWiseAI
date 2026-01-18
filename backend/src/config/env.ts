import dotenv from 'dotenv';

//Load environment variables from .env file
dotenv.config();

interface Config{
    nodeEnv: string;
    port: number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpire: string;
    geminiApiKey: string;
    clientUrl: string;
}

const config: Config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskwise-ai',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
}

//Validate essential environment variables
if(!config.jwtSecret || !config.geminiApiKey){
    throw new Error("Essential environment variables are missing.");
}

export default config;