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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationName1701152217600 = void 0;
class MigrationName1701152217600 {
    constructor() {
        this.name = "MigrationName1701152217600";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(60) NOT NULL, "email" character varying(60) NOT NULL, "senha" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "to_do" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "text" character varying(60) NOT NULL, "color" character varying NOT NULL DEFAULT '#1877F2', "isFavorited" boolean NOT NULL DEFAULT false, "isDone" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_19d14b861427e18d619639c8f2b" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "to_do" ADD CONSTRAINT "FK_dc00b4c082848833754e5ed9a30" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "to_do" DROP CONSTRAINT "FK_dc00b4c082848833754e5ed9a30"`);
            yield queryRunner.query(`DROP TABLE "to_do"`);
            yield queryRunner.query(`DROP TABLE "user"`);
        });
    }
}
exports.MigrationName1701152217600 = MigrationName1701152217600;
