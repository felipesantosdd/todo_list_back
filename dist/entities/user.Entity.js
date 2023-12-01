"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const todo_Entity_1 = __importDefault(require("./todo.Entity"));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 60 })
], User.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 60 })
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" })
], User.prototype, "senha", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => todo_Entity_1.default, (todo) => todo.user)
], User.prototype, "todos", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.default = User;
