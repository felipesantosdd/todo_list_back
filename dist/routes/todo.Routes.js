"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRoutes = void 0;
const todo_Controller_1 = __importDefault(require("../controllers/todo.Controller"));
const express_1 = require("express");
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
exports.todoRoutes = (0, express_1.Router)();
exports.todoRoutes.get("/", isAuthenticated_1.default, todo_Controller_1.default.getAll);
exports.todoRoutes.post("/", isAuthenticated_1.default, todo_Controller_1.default.create);
exports.todoRoutes.get("/:id", isAuthenticated_1.default, todo_Controller_1.default.getById);
exports.todoRoutes.patch("/:id", isAuthenticated_1.default, todo_Controller_1.default.update);
exports.todoRoutes.delete("/:id", isAuthenticated_1.default, todo_Controller_1.default.delete);
