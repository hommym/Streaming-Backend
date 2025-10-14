import Event from "events";
import { CacheArgs, ResetAccountEmailArgs, ServerType, WelcomeEmailArgs } from "../types/generalTypes";
import { emailService } from "../common/utils/services/emailService";
import { redis } from "../common/utils/services/redis";


type EventName = {
  "send-congrats-email": WelcomeEmailArgs;
  "send-reset-account-email": ResetAccountEmailArgs;
  "cache-data": CacheArgs;
};

class ServerEvents {
  private event = new Event();

  private createListener(eventName: string, method: any) {
    this.event.on(eventName, method);
  }

  setUpAllListners(serverType: ServerType) {
    // all eventListners are setup here
    console.log("Setting Up event listeners...");

    switch (serverType) {
      case "main":
        // events for main server
        this.createListener("send-congrats-email", emailService.sendWelcomeEmail);
        this.createListener("send-reset-account-email", emailService.sendPasswordResetEmail);
        this.createListener("cache-data", redis.cacheData);
        break;

      case "file":
        // events for file server
        break;

      default:
        // events for websocket server
        break;
    }

    process.on("exit",async ()=>{
      // releease resources synchronous
      console.log("Resources released")
    })
    console.log("Listeners Setup");
  }

  emit<T extends keyof EventName>(eventName: T, data: EventName[T]) {
    this.event.emit(eventName, data);
  }
}

export const serverEvents = new ServerEvents();
