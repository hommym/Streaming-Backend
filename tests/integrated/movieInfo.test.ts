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
    expect((await req.get("/api/v1/movie-info/category/top_rated").send()).status).toBe(200);

    expect((await req.get("/api/v1/movie-info/category/upcoming").send()).status).toBe(200);

    expect((await req.get("/api/v1/movie-info/category/upcoming").send()).status).toBe(200);

    expect((await req.get("/api/v1/movie-info/category/upcoming").send()).status).toBe(200);
  });

  it("Testing Endpoint for getting movie category using invalid cat...", async () => {
    expect((await req.get("/api/v1/movie-info/category/top-rated").send()).status).toBe(400);

    expect((await req.get("/api/v1/movie-info/category/upcomingg").send()).status).toBe(400);

    expect((await req.get("/api/v1/movie-info/category/now-playing").send()).status).toBe(400);

    expect((await req.get("/api/v1/movie-info/category/popularr").send()).status).toBe(400);
  });

  it("Testing Endpoint for searching for movies using keywords...", async () => {
    expect((await req.get("/api/v1/movie-info/search?keyword=twilight").send()).status).toBe(200);
    expect((await req.get("/api/v1/movie-info/search?keyword=twilight&page=2").send()).status).toBe(200);
    expect((await req.get("/api/v1/movie-info/search?page=1").send()).status).toBe(200);
  });


  it("Testing Endpoint for getting details of movies ...", async () => {
    expect((await req.get("/api/v1/movie-info/detail?movieId=twilight").send()).status).toBe(400);
     expect((await req.get("/api/v1/movie-info/detail").send()).status).toBe(400);
    expect((await req.get("/api/v1/movie-info/detail?movieId=100").send()).status).toBe(200);
  });
  afterAll(async () => {
    await database.close();
    await redis.disconnect();
  });
});
