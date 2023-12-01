"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const dataSourceConfig = () => {
    const migrationPath = path_1.default.join(__dirname, "./migrations/**.{ts,js}");
    const entitiesPath = path_1.default.join(__dirname, "./entities/**.{ts,js}");
    const env = dotenv.config();
    if (!env.parsed.DB_NAME ||
        !env.parsed.DB_HOST ||
        !env.parsed.DB_USERNAME ||
        !env.parsed.DB_PASSWORD) {
        throw new Error("Missing required environment variables");
    }
    if (env.parsed.ENVIRONMENT === "test") {
        return {
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            entities: [entitiesPath]
        };
    }
    return {
        type: "postgres",
        database: env.parsed.ENVIRONMENT === "development"
            ? env.parsed.DB_NAME
            : env.parsed.DOCKER_DB_NAME,
        host: env.parsed.ENVIRONMENT === "development"
            ? env.parsed.DB_HOST
            : env.parsed.DOCKER_DB_HOST,
        port: env.parsed.ENVIRONMENT === "development"
            ? parseInt(env.parsed.DB_PORT)
            : parseInt(env.parsed.DOCKER_DB_PORT),
        username: env.parsed.ENVIRONMENT === "development"
            ? env.parsed.DB_USERNAME
            : env.parsed.DOCKER_DB_USERNAME,
        password: env.parsed.ENVIRONMENT === "development"
            ? String(env.parsed.DB_PASSWORD)
            : String(env.parsed.DOCKER_DB_PASSWORD),
        logging: ["error"],
        entities: [entitiesPath],
        migrations: [migrationPath],
        synchronize: false
    };
};
const AppDataSource = new typeorm_1.DataSource(dataSourceConfig());
exports.AppDataSource = AppDataSource;
