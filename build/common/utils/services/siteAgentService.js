"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteAgentService = void 0;
const playwrightService_1 = require("./playwrightService");
class SiteAgentService {
    constructor() {
        this.setUpEvents = () => {
            // browse events to listen to and record
            console.log("events been added");
            // this.tab.evaluate(() => {
            //   document.addEventListener("keypress", (e) => {
            //     console.log(e.key);
            //   });
            // });
        };
        this.createTab = async (url) => {
            this.tab = await playwrightService_1.playwrightService.browser.newPage();
            this.tab.addListener("load", () => {
                this.setUpEvents();
            });
            this.tab.goto(url, { timeout: 3000000 });
        };
        this.inputEventHandler = async (e) => {
            console.log("Type");
        };
        this.learner = async () => {
            const cmdArgs = process.argv;
            if (cmdArgs.length !== 3)
                throw new Error("No url passed");
            await playwrightService_1.playwrightService.launchBrowser(false);
            await this.createTab(cmdArgs[2]);
        };
    }
    executer() { }
}
exports.siteAgentService = new SiteAgentService();
if (require.main === module) {
    exports.siteAgentService.learner();
}
