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

    const isDevelopment = env.parsed.ENVIRONMENT === "development"

    return {
        type: "postgres",
        database: isDevelopment ? env.parsed.DB_NAME : env.parsed.DB_TESTE_NAME,
        host: isDevelopment ? env.parsed.DB_HOST : env.parsed.DB_TESTE_HOST,
        port: isDevelopment
            ? parseInt(env.parsed.DB_PORT || "5432")
            : parseInt(env.parsed.DB_TESTE_PORT || "5432"),
        username: isDevelopment
            ? env.parsed.DB_USERNAME
            : env.parsed.DB_TESTE_USERNAME,
        password: isDevelopment
            ? env.parsed.DB_PASSWORD
            : env.parsed.DB_TESTE_PASSWORD,
        logging: ["error"],
        entities: [entitiesPath],
        migrations: [migrationPath],
        synchronize: isDevelopment ? false : true,
    }
}

const AppDataSource = new DataSource(dataSourceConfig())

export { AppDataSource }
