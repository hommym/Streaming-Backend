"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("../../database/database");
const router_1 = require("./router");
const errorHandler_1 = require("../../common/middlewares/errorHandler");
const serverEvents_1 = require("../../events/serverEvents");
const redis_1 = require("../../common/utils/services/redis");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], credentials: true }));
exports.app.use(express_1.default.json());
// routes
exports.app.use("/api/v1", router_1.mainServerRouter);
// error handling middlware
exports.app.use(errorHandler_1.errorHandler);
const port = process.env.PORT ? process.env.PORT : 8000;
const startServer = async () => {
    try {
        await database_1.database.dbInit();
        serverEvents_1.serverEvents.setUpAllListners("main");
        await redis_1.redis.connect();
        exports.app.listen(port, async () => {
            console.log(`Server listening on port ${port}..`);
        });
    }
    catch (error) {
        // log to loging file
        console.log(error);
    }
};
exports.startServer = startServer;
if (require.main === module) {
    (0, exports.startServer)();
}
