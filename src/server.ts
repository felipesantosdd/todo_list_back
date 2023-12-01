import "reflect-metadata"
import app from "./app"
import { AppDataSource } from "./data-source"

AppDataSource.initialize()
    .then(() => {
        const PORT = Number(process.env.API_PORT)
        app.listen(PORT, () => console.log(`Tudo pronto, servidor rodando na porta ${PORT}`))
    })
    .catch((error) => console.error(error))
