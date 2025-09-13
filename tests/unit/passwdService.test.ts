import { passwdService } from "../../src/common/utils/services/passwdService";


describe("Running PasswordService tests...", () => {
  it("Runing Paswword encryption test...",() => {
    expect(passwdService.encryptData("Password1234")).resolves;
  });

  it("Runing Paswword decryption test on correct passwd...", async () => {
    const hashed = await passwdService.encryptData("Password1234");
    expect(passwdService.verifyEncryptedData("Password1234", hashed)).resolves;
  });

  it("Runing Paswword decryption test on wrong passwd...", async () => {
    const hashed = await passwdService.encryptData("Password1234");
    expect(passwdService.verifyEncryptedData("Password12", hashed)).rejects;
  });
});
