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
    let userToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield data_source_1.AppDataSource.initialize()
            .then((res) => {
            connection = res;
        })
            .catch((err) => {
            console.error("Error during Data Source initialization", err);
        });
        const newUser = {
            nome: "teste",
            email: "teste@gmail.com",
            senha: "123456"
        };
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        const user = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        });
        userToken = user.body.token;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    it("GET /todos/:id - Deve ser possível buscar um todo pelo seu id", () => __awaiter(void 0, void 0, void 0, function* () {
        const newTodo = {
            title: "teste1",
            text: "teste1"
        };
        const todo = yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    }));
    it("GET /todos/:id - Não deve ser possível buscar um todo sem estar logado", () => __awaiter(void 0, void 0, void 0, function* () {
        const newTodo = {
            title: "teste2",
            text: "teste2"
        };
        const todo = yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default).get(`/todos/${todo.body.id}`);
        expect(response.body).toHaveProperty("error");
        expect(response.status).toBe(401);
    }));
    it("GET /todos/:id - Não deve ser possível buscar um todo de outro usuário", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser2 = {
            nome: "teste",
            email: "teste2@gmail.com",
            senha: "123456"
        };
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser2);
        const user2 = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser2.email,
            senha: newUser2.senha
        });
        const newTodo = {
            title: "teste3",
            text: "teste3"
        };
        const todo = yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user2.body.token}`);
        expect(response.body).toHaveProperty("error");
        expect(response.status).toBe(401);
    }));
    it("GET /todos - Deve ser possível buscar apenas os todos do usuário logado", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            nome: "teste5",
            email: "teste5@gmail.com",
            senha: "123456"
        };
        yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        const user = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        });
        const newTodo = {
            title: "teste3",
            text: "teste3"
        };
        yield (0, supertest_1.default)(app_1.default)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo);
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/todos") // Corrigido: a rota GET deve ser usada para buscar todos os todos do usuário
            .set("Authorization", `Bearer ${user.body.token}`);
        expect(response.body).toHaveLength(0); // Corrigido: verificar o comprimento da resposta
        expect(response.status).toBe(200);
    }));
});
