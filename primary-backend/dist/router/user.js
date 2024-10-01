"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const body = req.body;
    const parseData = types_1.signupSchema.safeParse(body);
    if (!parseData.success) {
        return res.status(401).json({
            message: 'Incorrect Inputs!'
        });
    }
    const userExist = yield db_1.prismaClient.user.findFirst({
        where: {
            email: (_a = parseData.data) === null || _a === void 0 ? void 0 : _a.username
        }
    });
    if (userExist) {
        return res.status(403).json({
            message: 'user exist!'
        });
    }
    yield db_1.prismaClient.user.create({
        data: {
            email: (_b = parseData.data) === null || _b === void 0 ? void 0 : _b.username,
            //todo:user salt to hash password  
            password: (_c = parseData.data) === null || _c === void 0 ? void 0 : _c.password,
            name: (_d = parseData.data) === null || _d === void 0 ? void 0 : _d.name,
        }
    });
    return res.json({
        message: 'User created!'
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const body = req.body;
    const parseData = types_1.signinSchema.safeParse(body);
    console.log(parseData);
    if (!parseData.success) {
        return res.status(401).json({
            message: 'Incorrect Inputs!'
        });
    }
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            email: (_e = parseData.data) === null || _e === void 0 ? void 0 : _e.username,
            password: (_f = parseData.data) === null || _f === void 0 ? void 0 : _f.password
        }
    });
    if (!user) {
        return res.status(401).json({
            message: 'user does not exist'
        });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id
    }, config_1.JWT_PASSWORD);
    return res.status(200).json({
        message: 'Sign in sucsess',
        token,
    });
}));
//@ts-ignore
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            id,
        },
        select: {
            name: true,
            email: true
        }
    });
    return res.json({
        user
    });
}));
exports.userRouter = router;
