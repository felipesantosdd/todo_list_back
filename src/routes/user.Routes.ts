import UserController from "../controllers/user.Controller"
import { Router } from "express"

export const userRoutes = Router()

userRoutes.get("/", UserController.getAll)
userRoutes.post("/", UserController.create)
userRoutes.get("/:id", UserController.getById)
userRoutes.post("/login", UserController.login)
