import "reflect-metadata"
import app from "./app"
import { AppDataSource } from "./data-source"

AppDataSource.initialize()
    .then(() => {
        const PORT = Number(process.env.API_PORT)
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
    .catch((error) => console.error(error))
