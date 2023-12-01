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
const error_1 = require("../error");
const todo_Service_1 = __importDefault(require("../services/todo.Service"));
class ToDoController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todo = yield todo_Service_1.default.create(req.body, req.user.id);
                return res.status(201).json(todo);
            }
            catch (error) {
                if (error instanceof error_1.AppError) {
                    return res.status(error.statusCode).json({
                        error: error.message
                    });
                }
                else {
                    return res.status(400).json({ erro: error.message });
                }
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield todo_Service_1.default.getAll(req.user.id);
                return res.status(200).json(todos);
            }
            catch (error) {
                if (error instanceof error_1.AppError) {
                    return res.status(error.statusCode).json({
                        error: error.message
                    });
                }
                else {
                    return res.status(400).json({ erro: error.message });
                }
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todo = yield todo_Service_1.default.getById(req.params.id, req.user.id);
                return res.status(200).json(todo);
            }
            catch (error) {
                if (error instanceof error_1.AppError) {
                    return res.status(error.statusCode).json({
                        error: error.message
                    });
                }
                else {
                    return res.status(400).json({ erro: error.message });
                }
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todoId = req.params.id;
                const userId = req.user.id;
                const todoUpdate = req.body;
                const todo = yield todo_Service_1.default.update(todoId, userId, todoUpdate);
                return res.status(200).json(todo);
            }
            catch (error) {
                if (error instanceof error_1.AppError) {
                    return res.status(error.statusCode).json({
                        error: error.message
                    });
                }
                else {
                    return res.status(400).json({ erro: error.message });
                }
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield todo_Service_1.default.delete(req.params.id, req.user.id);
                return res.status(200).json();
            }
            catch (error) {
                if (error instanceof error_1.AppError) {
                    return res.status(error.statusCode).json({
                        error: error.message
                    });
                }
                else {
                    return res.status(400).json({ erro: error.message });
                }
            }
        });
    }
}
exports.default = ToDoController;
