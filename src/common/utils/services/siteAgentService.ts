import { playwrightService } from "./playwrightService";
import { Page } from "playwright";

class SiteAgentService {
  tab: Page;

  private setUpEvents = () => {
    // browse events to listen to and record
    console.log("events been added");
    
    // this.tab.evaluate(() => {
    //   document.addEventListener("keypress", (e) => {
    //     console.log(e.key);
    //   });
    // });
  };

  private createTab = async (url: string) => {
    this.tab = await playwrightService.browser.newPage();
    this.tab.addListener("load", () => {
      this.setUpEvents();
    });
    this.tab.goto(url, { timeout: 3000000 });
  };

  private inputEventHandler = async (e: any) => {
    console.log("Type");
  };

  public learner = async () => {
    const cmdArgs: string[] = process.argv;
    if (cmdArgs.length !== 3) throw new Error("No url passed");
    await playwrightService.launchBrowser(false);
    await this.createTab(cmdArgs[2]);
  };

  public executer() {}
}

export const siteAgentService = new SiteAgentService();

if (require.main === module) {
  siteAgentService.learner();
}
