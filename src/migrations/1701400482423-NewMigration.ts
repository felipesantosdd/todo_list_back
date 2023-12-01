import { MigrationInterface, QueryRunner } from "typeorm"

export class NewMigration1701400482423 implements MigrationInterface {
    name = "NewMigration1701400482423"

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar se a tabela "user" não existe antes de criar
        const userTableExists = await queryRunner.hasTable("user")
        if (!userTableExists) {
            await queryRunner.query(`
                CREATE TABLE "user" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "nome" character varying(60) NOT NULL,
                    "email" character varying(60) NOT NULL,
                    "senha" character varying NOT NULL,
                    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                )
            `)
        }

        // Verificar se a tabela "to_do" não existe antes de criar
        const toDoTableExists = await queryRunner.hasTable("to_do")
        if (!toDoTableExists) {
            await queryRunner.query(`
                CREATE TABLE "to_do" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "title" character varying(60),
                    "text" character varying(600),
                    "color" character varying NOT NULL DEFAULT '##FFFFFF',
                    "isFavorited" boolean NOT NULL DEFAULT false,
                    "userId" uuid,
                    CONSTRAINT "PK_19d14b861427e18d619639c8f2b" PRIMARY KEY ("id")
                )
            `)

            // Verificar se a tabela "user" existe antes de adicionar a restrição de chave estrangeira
            if (userTableExists) {
                await queryRunner.query(`
                    ALTER TABLE "to_do" ADD CONSTRAINT "FK_dc00b4c082848833754e5ed9a30" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                `)
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Verificar se a tabela "to_do" existe antes de remover as restrições e a tabela
        const toDoTableExists = await queryRunner.hasTable("to_do")
        if (toDoTableExists) {
            await queryRunner.query(`
                ALTER TABLE "to_do" DROP CONSTRAINT "FK_dc00b4c082848833754e5ed9a30"
            `)

            await queryRunner.query(`
                DROP TABLE "to_do"
            `)
        }

        // Verificar se a tabela "user" existe antes de remover a tabela
        const userTableExists = await queryRunner.hasTable("user")
        if (userTableExists) {
            await queryRunner.query(`
                DROP TABLE "user"
            `)
        }
    }
}
