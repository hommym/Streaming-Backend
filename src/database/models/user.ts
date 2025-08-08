// Domain model and DB record types for the `user` table

export enum UserType {
  Admin = "admin",
  Normal = "norm",
}

// CamelCase domain model used across the app
export interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  userType: UserType;
}

// Shape as it exists in the database (snake_case, exact column names)
export interface UserRecord {
  id: number;
  full_name: string;
  email: string;
  passwd: string;
  user_type: UserType; // ENUM('admin','norm')
}

export type NewUser = Omit<User, "id">;
export type NewUserRecord = Omit<UserRecord, "id">;

// Mappers between DB rows and domain model
export function mapUserRecordToUser(record: UserRecord): User {
  return {
    id: Number(record.id),
    fullName: record.full_name,
    email: record.email,
    passwordHash: record.passwd,
    userType: record.user_type,
  };
}

export function mapNewUserToRecord(user: NewUser): NewUserRecord {
  return {
    full_name: user.fullName,
    email: user.email,
    passwd: user.passwordHash,
    user_type: user.userType,
  };
}

export function mapUserToRecord(user: User): UserRecord {
  return {
    id: user.id,
    full_name: user.fullName,
    email: user.email,
    passwd: user.passwordHash,
    user_type: user.userType,
  };
}
