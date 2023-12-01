import { Request, Response } from "express"
import { AppError } from "../error"
import ToDoService from "../services/todo.Service"
import { IToDo, IUpdateToDoRequest } from "../interfaces/todo.Interface"

class ToDoController {
    static async create(req: Request | any, res: Response): Promise<Response> {
        try {
            const todo = await ToDoService.create(req.body, req.user.id)
            return res.status(201).json(todo)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async getAll(req: Request | any, res: Response): Promise<Response> {
        try {
            const todos: IToDo[] = await ToDoService.getAll(req.user.id)
            return res.status(200).json(todos)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async getById(req: Request | any, res: Response): Promise<Response> {
        try {
            const todo: IToDo = await ToDoService.getById(
                req.params.id,
                req.user.id
            )
            return res.status(200).json(todo)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async update(req: Request | any, res: Response): Promise<Response> {
        try {
            const todoId: string = req.params.id
            const userId: string = req.user.id
            const todoUpdate: IUpdateToDoRequest = req.body
            const todo: IToDo = await ToDoService.update(
                todoId,
                userId,
                todoUpdate
            )
            return res.status(200).json(todo)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async delete(req: Request | any, res: Response): Promise<Response> {
        try {
            await ToDoService.delete(req.params.id, req.user.id)
            return res.status(200).json()
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }
}

export default ToDoController
