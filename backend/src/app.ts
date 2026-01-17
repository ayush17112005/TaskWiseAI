import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/env';
import { errorHandler } from './middlewares/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';

const app: Application = express();

// MIDDLEWARE

app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES

app.get('/health', (_req: Request, res:  Response) => {
  res.status(200).json({
    success: true,
    message: 'TaskWise AI Backend is running!  🚀',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.get('/', (_req: Request, res:  Response) => {
  res.status(200).json({
    success: true,
    message:  'Welcome to TaskWise AI API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth:  '/api/auth',
    },
  });
});

// 📚 API Routes
app.use('/api/auth', authRoutes);

// 📚 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================
// ERROR HANDLER (must be last!)
// ============================================
app.use(errorHandler);

export default app;