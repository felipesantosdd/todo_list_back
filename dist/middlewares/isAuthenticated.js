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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const error_1 = require("../error");
function isAuthenticated(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = request.headers.authorization;
        if (!token) {
            return response.status(401).json({ error: "Não autorizado" });
        }
        token = token.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    throw new error_1.AppError("Sessão invalálida.", 401);
                }
                else {
                    return response.status(401).json({
                        error: error.message
                    });
                }
            }
            request.user = {
                id: decoded.sub,
                email: decoded.email
            };
            return next();
        });
    });
}
exports.default = isAuthenticated;
