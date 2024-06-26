import "reflect-metadata"
import * as dotenv from "dotenv"
import { DataSourceOptions, DataSource } from "typeorm"
import path from "path"

const dataSourceConfig = (): DataSourceOptions => {
    const migrationPath = path.join(__dirname, "./migrations/**.{ts,js}")
    const entitiesPath = path.join(__dirname, "./entities/**.{ts,js}")

    const env = process.env

    dotenv.config();


    if (env.ENVIRONMENT === "test") {
        return {
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            entities: [entitiesPath]
        }
    }

    return {
        type: "postgres",
        database: env.DB_NAME,
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT),
        username: env.DB_USERNAME,
        password: String(env.DB_PASSWORD),
        logging: ["error"],
        entities: [entitiesPath],
        migrations: [migrationPath],
        synchronize: false
    }
}

const AppDataSource = new DataSource(dataSourceConfig())

export { AppDataSource }
