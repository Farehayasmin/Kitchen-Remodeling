import dotenv from "dotenv";
import path from "path";

// Load .env variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

const Config = {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  database_url: process.env.DATABASE_URL || "",
  frontend_url: process.env.FRONTEND_URL || "",
};

export default Config;