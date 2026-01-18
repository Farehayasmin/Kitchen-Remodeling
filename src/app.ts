import express, { Application } from 'express';
import cors from 'cors';
import routes from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';



const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Kitchen Remodeling API is running' });
});

// Routes
app.use('/api/v1', routes);

// Global error handler
app.use(globalErrorHandler);

export default app;