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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const user_Entity_1 = __importDefault(require("../entities/user.Entity"));
const error_1 = require("../error");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    static create(newUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailUsed = yield this.userRepository.findOne({
                where: { email: newUserData.email }
            });
            if (emailUsed) {
                throw new error_1.AppError("Este email já está sendo usado", 409);
            }
            const salt = (0, bcryptjs_1.genSaltSync)(10);
            newUserData.senha = (0, bcryptjs_1.hashSync)(newUserData.senha, salt);
            const newUser = this.userRepository.create(newUserData);
            yield this.userRepository.save(newUser);
            return newUser;
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find();
            if (users.length <= 0) {
                throw new error_1.AppError("Ainda sem usuarios cadastrados", 404);
            }
            else if (!users) {
                throw new error_1.AppError("Algo deu errado", 400);
            }
            return users;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { id: id },
                relations: ["todos"]
            });
            if (!user) {
                throw new error_1.AppError("Usuario nao encontrado", 400);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { senha } = user, response = __rest(user, ["senha"]);
            return response;
        });
    }
    static login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: {
                    email: data.email
                },
                relations: ["todos"]
            });
            if (!user) {
                throw new error_1.AppError("Usuário e/ou senha inválidos", 401);
            }
            const passwordMatch = yield (0, bcryptjs_1.compare)(data.senha, user.senha);
            if (!passwordMatch) {
                throw new error_1.AppError("Usuário e/ou senha inválidos", 401);
            }
            const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.SECRET_KEY, {
                subject: user.id,
                expiresIn: "30m"
            });
            const response = {
                id: user.id,
                email: user.email,
                nome: user.nome,
                todos: user.todos,
                token: token
            };
            return response;
        });
    }
}
UserService.userRepository = data_source_1.AppDataSource.getRepository(user_Entity_1.default);
exports.default = UserService;
