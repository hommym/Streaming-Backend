import TestAgent from "supertest/lib/agent";
import { redis } from "../../src/common/utils/services/redis";
import { database } from "../../src/database/database";
import { serverEvents } from "../../src/events/serverEvents";
import { app } from "../../src/servers/main/main";
import request from "supertest";

describe("Testing Auth Features...", () => {
  let fullName = "John Doe";
  let email = "testmail@gmail.com";
  let password = "strongPass123";
  let req: TestAgent;
  let token: string = "";

  beforeAll(async () => {
    await database.dbInit();
    serverEvents.setUpAllListners("main");
    await redis.connect();
    req = request(app);
  });

  it("Testing SignUp Api for new accounts and already existing accounts...", async () => {
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
    let res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;

    res = await req.post("/api/v1/auth/login").send({
      email: "test@ex.com",
      password,
    });
    expect(res.statusCode).toBe(404);
  });

  it("Testing login Api for accounts with wrong passwords...", async () => {
    const res = await req.post("/api/v1/auth/login").send({
      email,
      password: "123456",
    });
    expect(res.statusCode).toBe(401);
  });

  it("Testing Change Password Api without Auth Token...", async () => {
    const res = await req.post("/api/v1/auth/change-password").send({
      oldPassword: password,
      newPassword: "shouldFail",
    });
    expect(res.statusCode).toBe(401);
  });

  it("Testing Change Password Api...", async () => {
    let res = await req.post("/api/v1/auth/change-password").set("Authorization", `Bearer ${token}`).send({
      oldPassword: password,
      newPassword: "123456789",
    });
    expect(res.statusCode).toBe(200);

    res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(401);
    password = "123456789";

    res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Testing Update Account Api without Auth Token...", async () => {
    const res = await req.patch("/api/v1/auth/update-account").send({
      fullName: "Should Fail",
    });
    expect(res.statusCode).toBe(401);
  });

  it("Testing Update Account Api with Auth Token...", async () => {
    let res = await req.patch("/api/v1/auth/update-account").set("Authorization", `Bearer ${token}`).send({
      fullName: "Good Name",
    });
    expect(res.statusCode).toBe(200);

    res = await req.patch("/api/v1/auth/update-account").set("Authorization", `Bearer ${token}`).send({
      fullName: "Good Name",
      email: "iam@ex.com",
    });
    expect(res.statusCode).toBe(200);

    res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(404);

    fullName = "Good Name";
    email = "iam@ex.com";

    res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual({ fullName: "Good Name", email: "iam@ex.com" });
  });

  it("Testing Reset Account Api...", async () => {
    let res = await req.post("/api/v1/auth/reset-account").set("Authorization", `Bearer ${token}`).send({
      email,
    });
    expect(res.statusCode).toBe(200);

    res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(401);
  });

  it("Testing Delete Account Api without Auth Token...", async () => {
    const res = await req.delete("/api/v1/auth/").send();
    expect(res.statusCode).toBe(401);
  });

  it("Testing Delete Account Api...", async () => {
    let res = await req.delete("/api/v1/auth/").set("Authorization", `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);

    res = await req.post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await database.close();
    await redis.disconnect();
  });
});
