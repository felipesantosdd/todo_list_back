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
const supertest_1 = __importDefault(require("supertest"));
const data_source_1 = require("../../data-source");
const app_1 = __importDefault(require("../../app"));
describe("/todos", () => {
    let connection;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield data_source_1.AppDataSource.initialize()
            .then((res) => {
            connection = res;
        })
            .catch((err) => {
            console.error("Error during Data Source initialization", err);
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    it("DELETE /todos/:id - Deve ser possivel deletar um todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            nome: "teste",
            email: "teste1@gmail.com",
            senha: "123456"
        };
        const newTodo = {
            title: "teste",
            text: "teste"
        };
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        const user = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        });
        const todo = yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user.body.token}`);
        expect(response.status).toBe(200);
    }));
    it("DELETE /todos/:id - Nao deve ser possivel deletat um todo sem estar logado", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            nome: "teste",
            email: "teste2@gmail.com",
            senha: "123456"
        };
        const newTodo = {
            title: "teste",
            text: "teste"
        };
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        const user = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        });
        const todo = yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/todos/${todo.body.id}`);
        expect(response.body).toHaveProperty("error");
        expect(response.status).toBe(401);
    }));
    it("DELETE /todos/:id - Nao deve ser possivel deletat um todo de outro usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            nome: "teste1",
            email: "teste1@gmail.com",
            senha: "123456"
        };
        const newUser2 = {
            nome: "teste1",
            email: "teste2@gmail.com",
            senha: "123456"
        };
        const newTodo = {
            title: "teste3",
            text: "teste"
        };
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser2);
        const user = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        });
        const user2 = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser2.email,
            senha: newUser2.senha
        });
        const todo = yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user2.body.token}`);
        expect(response.body).toHaveProperty("error");
        expect(response.status).toBe(401);
    }));
});
