import "reflect-metadata"
import app from "./app"
import { AppDataSource } from "./data-source"

AppDataSource.initialize()
    .then(() => {
        console.log(process.env)
        const PORT = parseInt(process.env.API_PORT) || 3000
        app.listen(PORT, () => console.log(`Tudo pronto, servidor rodando na porta ${PORT}`))
    })
    .catch((error) => console.error(error))
