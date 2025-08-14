

export type ServerType="main"|"file"|"ws"

export type WelcomeEmailArgs = {
  recipientEmail: string;
  fullName: string;
};

export type ResetAccountEmailArgs = {
  recipientEmail: string;
  fullName: string;
  plainPassword: string;
};