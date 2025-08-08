"use strict";
// Domain model and DB record types for the `user` table
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
exports.mapUserRecordToUser = mapUserRecordToUser;
exports.mapNewUserToRecord = mapNewUserToRecord;
exports.mapUserToRecord = mapUserToRecord;
var UserType;
(function (UserType) {
    UserType["Admin"] = "admin";
    UserType["Normal"] = "norm";
})(UserType || (exports.UserType = UserType = {}));
// Mappers between DB rows and domain model
function mapUserRecordToUser(record) {
    return {
        id: Number(record.id),
        fullName: record.full_name,
        email: record.email,
        passwordHash: record.passwd,
        userType: record.user_type,
    };
}
function mapNewUserToRecord(user) {
    return {
        full_name: user.fullName,
        email: user.email,
        passwd: user.passwordHash,
        user_type: user.userType,
    };
}
function mapUserToRecord(user) {
    return {
        id: user.id,
        full_name: user.fullName,
        email: user.email,
        passwd: user.passwordHash,
        user_type: user.userType,
    };
}
