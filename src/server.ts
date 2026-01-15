

import app from './app';
import Config from './config';
import prisma from './utils/prisma';



const port = Config.port || 5000;

async function server() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Database connection status: ${process.env.DATABASE_URL ? 'Connected' : 'Not Configured'}`);
    });
  } catch (err) {

    console.error("Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();