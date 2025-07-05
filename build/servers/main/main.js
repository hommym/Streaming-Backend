"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("../../database/database");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], credentials: true }));
// routes
// app.use("/api/v1", httpRouter);
// error handling middlware
// app.use(errorHandler);
// ws middleware
// ws.use(verifyJwtForWs)
const port = process.env.PORT ? process.env.PORT : 8000;
const startServer = async () => {
    try {
        exports.app.listen(port, async () => {
            await database_1.database.dbInit(true);
            console.log(`Server listening on port ${port}..`);
        });
    }
    catch (error) {
        // log to loging file
        console.log(error);
    }
};
startServer();
