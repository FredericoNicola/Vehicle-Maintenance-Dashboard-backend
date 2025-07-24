"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = void 0;
const SECRET = process.env.JWT_SECRET;
exports.SECRET = SECRET;
if (!SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}
