import ToDoController from "../controllers/todo.Controller"
import { Router } from "express"
import isAuthenticated from "../middlewares/isAuthenticated"

export const todoRoutes = Router()

todoRoutes.get("/", isAuthenticated, ToDoController.getAll)
todoRoutes.post("/", isAuthenticated, ToDoController.create)
todoRoutes.get("/:id", isAuthenticated, ToDoController.getById)
todoRoutes.patch("/:id", isAuthenticated, ToDoController.update)
todoRoutes.delete("/:id", isAuthenticated, ToDoController.delete)
