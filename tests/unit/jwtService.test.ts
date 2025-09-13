import { jwtService } from "../../src/common/utils/services/jwtService";

describe("Runing JwtService tests...", () => {
  it("Runing jwt generation and verification test...", () => {
    const userId = 1;
    const token = jwtService.generateToken(userId);
    expect(token).toBeDefined();

    expect(jwtService.verifyToken(token).userId).toBe(userId);
  });
});
