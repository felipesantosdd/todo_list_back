import "reflect-metadata"
import * as dotenv from "dotenv"
import { DataSourceOptions, DataSource } from "typeorm"
import path from "path"

const dataSourceConfig = (): DataSourceOptions => {
    const migrationPath = path.join(__dirname, "./migrations/**.{ts,js}")
    const entitiesPath = path.join(__dirname, "./entities/**.{ts,js}")

    // Certifique-se de que as variáveis de ambiente necessárias estejam definidas

    const env = dotenv.config()

    if (
        !env.parsed.DB_NAME ||
        !env.parsed.DB_HOST ||
        !env.parsed.DB_USERNAME ||
        !env.parsed.DB_PASSWORD
    ) {
        throw new Error("Missing required environment variables")
    }

    if (env.parsed.ENVIRONMENT === "test") {
        return {
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            entities: [entitiesPath],
        }
    }

    return {
        type: "postgres",
        database: env.parsed.DB_NAME,
        host: env.parsed.DB_HOST,
        port: parseInt(env.parsed.DB_PORT || "5432"),
        username: env.parsed.DB_USERNAME,
        password: String(env.parsed.DB_PASSWORD),
        logging: ["error"],
        entities: [entitiesPath],
        migrations: [migrationPath],
        synchronize: false,
    }
}

const AppDataSource = new DataSource(dataSourceConfig())

export { AppDataSource }
