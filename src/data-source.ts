import "reflect-metadata"
import * as dotenv from "dotenv"
import { DataSourceOptions, DataSource } from "typeorm"
import path from "path"

const dataSourceConfig = (): DataSourceOptions => {
    const migrationPath = path.join(__dirname, "./migrations/**.{ts,js}")
    const entitiesPath = path.join(__dirname, "./entities/**.{ts,js}")

    const env = dotenv.config()

    if (env && env.parsed && env.parsed.ENVIRONMENT === "test") {
        return {
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            entities: [entitiesPath]
        }
    }

    return {
        type: "postgres",
        database:
            env.parsed.ENVIRONMENT === "development"
                ? env.parsed.DB_NAME
                : env.parsed.DOCKER_DB_NAME,
        host:
            env.parsed.ENVIRONMENT === "development"
                ? env.parsed.DB_HOST
                : env.parsed.DOCKER_DB_HOST,
        port:
            env.parsed.ENVIRONMENT === "development"
                ? parseInt(env.parsed.DB_PORT)
                : parseInt(env.parsed.DOCKER_DB_PORT),
        username:
            env.parsed.ENVIRONMENT === "development"
                ? env.parsed.DB_USERNAME
                : env.parsed.DOCKER_DB_USERNAME,
        password:
            env.parsed.ENVIRONMENT === "development"
                ? String(env.parsed.DB_PASSWORD)
                : String(env.parsed.DOCKER_DB_PASSWORD),
        logging: ["error"],
        entities: [entitiesPath],
        migrations: [migrationPath],
        synchronize: false
    }
}

const AppDataSource = new DataSource(dataSourceConfig())

export { AppDataSource }
