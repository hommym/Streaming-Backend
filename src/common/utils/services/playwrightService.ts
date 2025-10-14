import { chromium, Browser, BrowserContext } from "playwright";

class PlayWrightService {
  private browserRef?: Browser;
  private context: BrowserContext;

  public launchBrowser = async (headlessMode: boolean = true) => {
    this.browserRef = await chromium.launch({ headless: headlessMode });
    // setting the device for te browser
    this.context = await this.browserRef.newContext();
  };

  public get browser() {
    if (!this.browserRef) throw new Error("browserRef is undefined please make sure browser has been launched");
    return this.context;
  }

  public closeBrowser = async () => {
    await this.context.close();
    await this.browserRef?.close();
  };
}

export const playwrightService = new PlayWrightService();
