import TestAgent from "supertest/lib/agent";
import { redis } from "../../src/common/utils/services/redis";
import { database } from "../../src/database/database";
import { serverEvents } from "../../src/events/serverEvents";
import { app } from "../../src/servers/main/main";
import request from "supertest";

describe("Testing Auth Features...", () => {
  beforeAll(async () => {
    await database.dbInit(true);
    serverEvents.setUpAllListners("main");
    await redis.connect();
  });

  it("Testing SignUp Api for new accounts and already existing accounts...", async () => {
    const fullName = "John Doe";
    const email = "testmail@gmail.com";
    const password = "strongPass123";
    const req = request(app);
    let res = await req.post("/api/v1/auth/signup").send({
      fullName,
      email,
      password,
    });
    expect(res.statusCode).toBe(200);

    res = await req.post("/api/v1/auth/signup").send({
      fullName,
      email,
      password,
    });
    expect(res.statusCode).toBe(409);
  });

  it("Testing login Api for already existing accounts and accounts that do not exist...", async () => {
    const email = "testmail@gmail.com";
    const password = "strongPass123";
    const req = request(app);
    let res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(200);

    res = await req.post("/api/v1/auth/login").send({
      email: "test@ex.com",
      password,
    });
    expect(res.statusCode).toBe(404);
  });

  it("Testing login Api for accounts with wrong passwords...", async () => {
    const email = "testmail@gmail.com";
    const password = "strongPass123";
    const req = request(app);
    const res = await req.post("/api/v1/auth/login").send({
      email,
      password: "123456",
    });
    expect(res.statusCode).toBe(401);
  });

  afterAll(async () => {
    await database.close();
    await redis.disconnect();
  });
});
