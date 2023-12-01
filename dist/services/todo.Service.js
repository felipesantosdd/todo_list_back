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
const data_source_1 = require("../data-source");
const todo_Entity_1 = __importDefault(require("../entities/todo.Entity"));
const user_Entity_1 = __importDefault(require("../entities/user.Entity"));
const error_1 = require("../error");
class ToDoService {
    static create(newTodoData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newTodoData.title || !newTodoData.text) {
                throw new error_1.AppError("O título e o texto são obrigatórios", 400);
            }
            const user = yield this.userRepository.findOne({
                where: { id: userId },
                relations: ["todos"]
            });
            const existingTodo = user.todos.find((todo) => todo.title === newTodoData.title);
            if (existingTodo) {
                throw new error_1.AppError("Este nome já foi usado", 409);
            }
            if (!user) {
                throw new error_1.AppError("Usuário inválido", 404);
            }
            const newTodo = yield this.todoRepository.save(newTodoData);
            newTodo.user = user;
            yield this.userRepository.save(user);
            yield this.todoRepository.save(newTodo);
            return newTodo;
        });
    }
    static getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { id: userId },
                relations: ["todos"]
            });
            return user.todos;
        });
    }
    static getById(todoId, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.todoRepository.findOne({
                where: { id: todoId },
                relations: ["user"]
            });
            if (!todo) {
                throw new error_1.AppError("Tarefa inválida", 404);
            }
            if (((_a = todo === null || todo === void 0 ? void 0 : todo.user) === null || _a === void 0 ? void 0 : _a.id) !== userId) {
                throw new error_1.AppError("Não autorizado", 401);
            }
            return todo;
        });
    }
    static update(todoId, userId, todoUpdate) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.todoRepository.findOne({
                where: {
                    id: todoId
                },
                relations: ["user"]
            });
            if (!todo) {
                throw new error_1.AppError("Tarefa nao encontrada", 404);
            }
            console.log((_a = todo === null || todo === void 0 ? void 0 : todo.user) === null || _a === void 0 ? void 0 : _a.id);
            console.log(userId);
            if (((_b = todo === null || todo === void 0 ? void 0 : todo.user) === null || _b === void 0 ? void 0 : _b.id) !== userId) {
                throw new error_1.AppError("Não autorizado", 401);
            }
            for (const key in todoUpdate) {
                if (Object.prototype.hasOwnProperty.call(todoUpdate, key)) {
                    if (key in todo) {
                        todo[key] = todoUpdate[key];
                    }
                }
            }
            yield this.todoRepository.save(todo);
            return todo;
        });
    }
    static delete(todoId, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.todoRepository.findOne({
                where: {
                    id: todoId
                },
                relations: ["user"]
            });
            if (!todo) {
                throw new error_1.AppError("Tarefa nao encontrada", 404);
            }
            if (((_a = todo === null || todo === void 0 ? void 0 : todo.user) === null || _a === void 0 ? void 0 : _a.id) !== userId) {
                throw new error_1.AppError("Não autorizado", 401);
            }
            yield this.todoRepository.delete(todo);
            return;
        });
    }
}
ToDoService.todoRepository = data_source_1.AppDataSource.getRepository(todo_Entity_1.default);
ToDoService.userRepository = data_source_1.AppDataSource.getRepository(user_Entity_1.default);
exports.default = ToDoService;
