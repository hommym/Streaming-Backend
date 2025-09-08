import { passwdService } from "../../src/common/utils/services/passwdService";


const rawPasswd="Password1234"


test("Runing Paswword encryption test...", async () => {
  expect(passwdService.encryptData(rawPasswd)).resolves;
});


test("Runing Paswword decryption test...", async () => {
   const hashed = await passwdService.encryptData(rawPasswd);
   expect(passwdService.verifyEncryptedData("Password1234",hashed)).resolves;
   expect(passwdService.verifyEncryptedData("Password12", hashed)).rejects;
});