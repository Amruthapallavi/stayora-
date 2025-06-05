import dotenv from "dotenv";
dotenv.config();
import app from "./src/app";
import connectDB from "./src/config/db";
import http from "http";
import './src/utils/cron';

import { initializeSocket } from "./src/config/socket";


const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initializeSocket(server); 

    server.listen(PORT, () => { 
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
