import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { globalErrorHandler } from './middlewares';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Kitchen Remodeling API is running' });
});

// Global error handler
app.use(globalErrorHandler);

export default app;