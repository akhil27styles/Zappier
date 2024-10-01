"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapcreateSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(5),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(3),
});
exports.signinSchema = zod_1.z.object({
    username: zod_1.z.string().min(5),
    password: zod_1.z.string().min(6),
});
exports.ZapcreateSchema = zod_1.z.object({
    availableTriggerId: zod_1.z.string(),
    triggerMetaData: zod_1.z.string(),
    actions: zod_1.z.array(zod_1.z.object({
        availableAction: zod_1.z.string(),
        actionMetaData: zod_1.z.string(),
    }))
});
