"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_Controller_1 = __importDefault(require("../controllers/user.Controller"));
const express_1 = require("express");
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.get("/", user_Controller_1.default.getAll);
exports.userRoutes.post("/", user_Controller_1.default.create);
exports.userRoutes.get("/:id", user_Controller_1.default.getById);
exports.userRoutes.post("/login", user_Controller_1.default.login);
