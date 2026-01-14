import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Kitchen Remodeling API is running' });
});

// Routes
app.use('/api', routes);

// Global error handler
app.use(globalErrorHandler);

export default app;