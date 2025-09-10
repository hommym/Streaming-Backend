import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { database } from "../../database/database";
import { mainServerRouter } from "./router";
import { errorHandler } from "../../common/middlewares/errorHandler";
import { serverEvents } from "../../events/serverEvents";
import { redis } from "../../common/utils/class/redis";

export const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], credentials: true }));

app.use(express.json());

// routes
app.use("/api/v1", mainServerRouter);

// error handling middlware
app.use(errorHandler);

const port = process.env.PORT ? process.env.PORT : 8000;

const startServer = async () => {
  try {
    app.listen(port, async () => {
      await database.dbInit(true);
      serverEvents.setUpAllListners("main");
      await redis.connect();
      console.log(`Server listening on port ${port}..`);
    });
  } catch (error) {
    // log to loging file
    console.log(error);
  }
};

startServer();
