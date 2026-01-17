import app from './app';
import config from './config/env';
import connectDB from './config/database';

// This is the entry point of your application
// It connects to the database and starts the HTTP server

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`TaskWise AI Backend Started!`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(`Server:  http://localhost:${config.port}`);
      console.log(`Health Check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown - Properly close connections when stopping server
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();