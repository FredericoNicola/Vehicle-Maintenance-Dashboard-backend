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
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role = "user" } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser)
        return res.status(400).json({ message: "User already exists" });
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield prisma_1.default.user.create({
        data: { email, password: hashedPassword },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const isValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isValid)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.SECRET, { expiresIn: "7d" });
    res.json({ token });
});
exports.loginUser = loginUser;
