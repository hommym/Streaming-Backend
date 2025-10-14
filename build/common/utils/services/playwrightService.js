"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playwrightService = void 0;
const playwright_1 = require("playwright");
class PlayWrightService {
    constructor() {
        this.launchBrowser = async (headlessMode = true) => {
            this.browserRef = await playwright_1.chromium.launch({ headless: headlessMode });
            // setting the device for te browser
            this.context = await this.browserRef.newContext();
        };
        this.closeBrowser = async () => {
            var _a;
            await this.context.close();
            await ((_a = this.browserRef) === null || _a === void 0 ? void 0 : _a.close());
        };
    }
    get browser() {
        if (!this.browserRef)
            throw new Error("browserRef is undefined please make sure browser has been launched");
        return this.context;
    }
}
exports.playwrightService = new PlayWrightService();
