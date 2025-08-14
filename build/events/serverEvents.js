"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverEvents = void 0;
const events_1 = __importDefault(require("events"));
const emailService_1 = require("../common/utils/services/emailService");
class ServerEvents {
    constructor() {
        this.event = new events_1.default();
    }
    createListener(eventName, method) {
        this.event.on(eventName, method);
    }
    setUpAllListners(serverType) {
        // all eventListners are setup here
        console.log("Setting Up event listeners...");
        switch (serverType) {
            case "main":
                // events for main server
                this.createListener("send-congrats-email", emailService_1.emailService.sendWelcomeEmail);
                this.createListener("send-reset-account-email", emailService_1.emailService.sendPasswordResetEmail);
                break;
            case "file":
                // events for file server
                break;
            default:
                // events for websocket server
                break;
        }
        console.log("Listeners Setup");
    }
    emit(eventName, data) {
        this.event.emit(eventName, data);
    }
}
exports.serverEvents = new ServerEvents();
