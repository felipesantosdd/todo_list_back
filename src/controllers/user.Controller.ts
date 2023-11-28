import { AppError } from "../error"
import { Request, Response } from "express"
import UserService from "../services/user.Service"
import { INewUserResponse, IUser } from "../interfaces/user.Interfaces"

class UserController {
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const user: INewUserResponse = await UserService.create(req.body)
            return res.status(201).json(user)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message,
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const users: IUser[] = await UserService.getAll()
            return res.status(200).json(users)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message,
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const user: INewUserResponse = await UserService.getById(
                req.params.id
            )
            return res.status(200).json(user)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message,
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const data = await UserService.login(req.body)
            return res.status(200).json(data)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message,
                })
            } else {
                return res.status(400).json({ erro: error.message })
            }
        }
    }
}

export default UserController
