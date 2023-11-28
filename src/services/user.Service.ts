import { AppDataSource } from "../data-source"
import User from "../entities/user.Entity"
import { AppError } from "../error"
import {
    ILoginRequest,
    ILoginResponse,
    INewUserRequest,
    INewUserResponse,
    IUser,
} from "../interfaces/user.Interfaces"
import { compare, genSaltSync, hashSync } from "bcryptjs"
import jwt from "jsonwebtoken"

class UserService {
    static userRepository = AppDataSource.getRepository(User)

    static async create(newUserData: INewUserRequest): Promise<IUser> {
        const emailUsed = await this.userRepository.findOne({
            where: { email: newUserData.email },
        })

        if (emailUsed) {
            throw new AppError("Este email já está sendo usado", 409)
        }

        const salt = genSaltSync(10)
        newUserData.senha = hashSync(newUserData.senha, salt)
        const newUser = this.userRepository.create(newUserData)

        await this.userRepository.save(newUser)

        return newUser
    }

    static async getAll(): Promise<IUser[]> {
        const users = await this.userRepository.find()
        if (users.length <= 0) {
            throw new AppError("Ainda sem usuarios cadastrados", 404)
        } else if (!users) {
            throw new AppError("Algo deu errado", 400)
        }
        return users
    }

    static async getById(id: string): Promise<INewUserResponse> {
        const user = await this.userRepository.findOne({
            where: { id: id },
            relations: ["todos"],
        })

        if (!user) {
            throw new AppError("Usuario nao encontrado", 400)
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha, ...response } = user

        return response
    }

    static async login(data: ILoginRequest): Promise<ILoginResponse> {
        const user = await this.userRepository.findOne({
            where: {
                email: data.email,
            },
            relations: ["todos"],
        })

        if (!user) {
            throw new AppError("Usuário e/ou senha inválidos", 401)
        }

        const passwordMatch = await compare(data.senha, user.senha)

        if (!passwordMatch) {
            throw new AppError("Usuário e/ou senha inválidos", 401)
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
            subject: user.id,
            expiresIn: "30m",
        })

        const response: ILoginResponse = {
            id: user.id,
            email: user.email,
            nome: user.nome,
            todos: user.todos,
            token: token,
        }

        return response
    }
}

export default UserService
