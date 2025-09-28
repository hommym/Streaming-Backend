import TestAgent from "supertest/lib/agent";
import request from "supertest";
import { app } from "../../src/servers/main/main";
import { database } from "../../src/database/database";
import { serverEvents } from "../../src/events/serverEvents";
import { redis } from "../../src/common/utils/services/redis";

describe("Testing Movie Info Features...", () => {
  let fullName = "John Doe";
  let email = "testmail2@gmail.com";
  let password = "strongPass123";
  let req: TestAgent;
  let token: string = "";

  beforeAll(async () => {
    await database.dbInit();
    serverEvents.setUpAllListners("main");
    await redis.connect();
    req = request(app);
    await req.post("/api/v1/auth/signup").send({
      fullName,
      email,
      password,
    });

    let res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });

    token = res.body.token;
  });

  it("Testing Endpoint for getting movie category using valid cat...", async () => {
    expect(req.get("/api/v1/movie-info/category/top_rated").set("Authorization", `Bearer ${token}`).send()).resolves;

    expect(req.get("/api/v1/movie-info/category/upcoming").set("Authorization", `Bearer ${token}`).send()).resolves;

    expect(req.get("/api/v1/movie-info/category/now_playing").set("Authorization", `Bearer ${token}`).send()).resolves;

    expect(req.get("/api/v1/movie-info/category/popular").set("Authorization", `Bearer ${token}`).send()).resolves;
  });

  it("Testing Endpoint for getting movie category using invalid cat...", async () => {
    expect(req.get("/api/v1/movie-info/category/top-rated").set("Authorization", `Bearer ${token}`).send()).rejects;

    expect(req.get("/api/v1/movie-info/category/upcomingg").set("Authorization", `Bearer ${token}`).send()).rejects;

    expect(req.get("/api/v1/movie-info/category/now-playing").set("Authorization", `Bearer ${token}`).send()).rejects;

    expect(req.get("/api/v1/movie-info/category/popularr").set("Authorization", `Bearer ${token}`).send()).rejects;
  });

    afterAll(async () => {
      await database.close();
      await redis.disconnect();
    });
});
