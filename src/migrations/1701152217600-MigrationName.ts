import { MigrationInterface, QueryRunner } from "typeorm"

export class MigrationName1701152217600 implements MigrationInterface {
    name = "MigrationName1701152217600"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(60) NOT NULL, "email" character varying(60) NOT NULL, "senha" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "to_do" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "text" character varying(60) NOT NULL, "color" character varying NOT NULL DEFAULT '#1877F2', "isFavorited" boolean NOT NULL DEFAULT false, "isDone" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_19d14b861427e18d619639c8f2b" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `ALTER TABLE "to_do" ADD CONSTRAINT "FK_dc00b4c082848833754e5ed9a30" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "to_do" DROP CONSTRAINT "FK_dc00b4c082848833754e5ed9a30"`
        )
        await queryRunner.query(`DROP TABLE "to_do"`)
        await queryRunner.query(`DROP TABLE "user"`)
    }
}
