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
describe("/user", () => {
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
        // await AppDataSource.dropDatabase()
        yield connection.destroy();
    }));
    it("POST /users/login - Deve ser possivel fazer o login", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            nome: "usuario",
            email: "usuario@gmail.com",
            senha: "senha123"
        };
        const user = yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        console.log(user.body);
        const response = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: "usuario@gmail.com",
            senha: "senha123"
        });
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("nome");
        expect(response.body).toHaveProperty("token");
        expect(response.status).toBe(200);
    }));
    it("POST /users/login - Nao deve ser possivel logar com dados incorretos", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            nome: "usuario",
            email: "usuario@gmail.com",
            senha: "senha123"
        };
        const user = yield (0, supertest_1.default)(app_1.default).post("/users").send(newUser);
        console.log(user.body);
        const response = yield (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: "usuario@gmail.com",
            senha: "outrassenha"
        });
        expect(response.body).toHaveProperty("error");
        expect(response.status).toBe(401);
    }));
});
