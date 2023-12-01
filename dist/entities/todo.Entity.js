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
exports.ToDo = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_Entity_1 = __importDefault(require("./user.Entity"));
let ToDo = class ToDo {
};
exports.ToDo = ToDo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], ToDo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 60 })
], ToDo.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 60 })
], ToDo.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "#1877F2" })
], ToDo.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false })
], ToDo.prototype, "isFavorited", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false })
], ToDo.prototype, "isDone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_Entity_1.default, (user) => user.todos)
], ToDo.prototype, "user", void 0);
exports.ToDo = ToDo = __decorate([
    (0, typeorm_1.Entity)()
], ToDo);
exports.default = ToDo;
