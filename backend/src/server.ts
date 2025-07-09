import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";
import http from "http";
import './utils/cron';

import { initializeSocket } from "./config/socket";


const PORT = process.env.PORT;

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
