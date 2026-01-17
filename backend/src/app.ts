import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import config from './config/env';

const app: Application = express();

//Middleware
app.use(cors({
    origin: config.clientUrl,
    credentials: true, //Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        timeStamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the TaskWise AI Backend API",
        version: '1.0.0',

    });
});

export default app;