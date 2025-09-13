import { emailService } from "../../src/common/utils/services/emailService";

describe("Running EmailService test...", () => {
  it("Welcome Email test...",  () => {
    expect(emailService.sendWelcomeEmail({ fullName: "Firstname Lastname", recipientEmail: "example@domain.com" })).resolves;
  });

  it("Welcome Email test...",  () => {
    expect(emailService.sendPasswordResetEmail({ fullName: "Firstname Lastname", recipientEmail: "example@domain.com", plainPassword: "1234566788" })).resolves;
  });

});
