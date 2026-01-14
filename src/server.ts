import dotenv from 'dotenv';
dotenv.config();
import app from './app';



const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database connection status: ${process.env.DATABASE_URL ? 'Connected' : 'Not Configured'}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

bootstrap();