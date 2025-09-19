import { redis } from "../../src/common/utils/services/redis";

describe("Testing Redis Service...", () => {
  it("Testing Redis Connection...", async () => {
    expect(await redis.connect()).toBe(true);
  });

  it("Testing Caching...", () => {
    expect(redis.cacheData({ key: "key", value: "Hello" })).resolves;
  });

  it("Testing Cache Retrieval...", async () => {
    expect(await redis.getCachedData("key")).toBe("Hello");
  });

  it("Testing Cache Removal...", async () => {
    await redis.removeCachedData("key");
    expect(await redis.getCachedData("key")).toBe(null);
  });

  afterAll(async () => {
    await redis.disconnect();
  });
});
