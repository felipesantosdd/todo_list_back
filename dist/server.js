"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./data-source");
data_source_1.AppDataSource.initialize()
    .then(() => {
    const PORT = Number(process.env.API_PORT);
    app_1.default.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
    .catch((error) => console.error(error));
