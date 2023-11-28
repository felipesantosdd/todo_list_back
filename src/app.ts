import express, { Application } from "express"
import cors from "cors"
import { userRoutes } from "./routes/user.Routes"
import { todoRoutes } from "./routes/todo.Routes"

const app: Application = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use(cors())

app.use("/users", userRoutes)
app.use("/todos", todoRoutes)

export default app
