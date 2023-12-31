import { AppDataSource } from "../data-source"
import ToDo from "../entities/todo.Entity"
import User from "../entities/user.Entity"
import { AppError } from "../error"
import {
    INewToDoRequest,
    IToDo,
    IUpdateToDoRequest
} from "../interfaces/todo.Interface"
import { IUser } from "../interfaces/user.Interfaces"

class ToDoService {
    static todoRepository = AppDataSource.getRepository(ToDo)
    static userRepository = AppDataSource.getRepository(User)

    static async create(newTodoData: INewToDoRequest, userId: string) {
        if (!newTodoData.title || !newTodoData.text) {
            throw new AppError("O título e o texto são obrigatórios", 400)
        }

        const userData = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["todos"]
        })

        const existingTodo = userData.todos.find(
            (todo) => todo.title === newTodoData.title
        )

        if (existingTodo) {
            throw new AppError("Este nome já foi usado", 409)
        }

        if (!userData) {
            throw new AppError("Usuário inválido", 404)
        }

        const newTodo = await this.todoRepository.save(newTodoData)
        newTodo.user = userData

        await this.userRepository.save(userData)
        await this.todoRepository.save(newTodo)

        const { user, ...response } = newTodo

        return response
    }

    static async getAll(userId: string): Promise<IToDo[]> {
        const user: IUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["todos"]
        })
        const sortedTodos = user.todos.sort((a, b) =>
            a.title.localeCompare(b.title)
        )
        return sortedTodos
    }

    static async getById(todoId: string, userId: string): Promise<ToDo> {
        const todo = await this.todoRepository.findOne({
            where: { id: todoId },
            relations: ["user"]
        })

        if (!todo) {
            throw new AppError("Tarefa inválida", 404)
        }

        if (todo?.user?.id !== userId) {
            throw new AppError("Não autorizado", 401)
        }

        return todo
    }

    static async update(
        todoId: string,
        userId: string,
        todoUpdate: IUpdateToDoRequest
    ): Promise<IToDo> {
        const todo: IToDo = await this.todoRepository.findOne({
            where: {
                id: todoId
            },
            relations: ["user"]
        })

        if (!todo) {
            throw new AppError("Tarefa nao encontrada", 404)
        }

        if (todo?.user?.id !== userId) {
            throw new AppError("Não autorizado", 401)
        }

        for (const key in todoUpdate) {
            if (Object.prototype.hasOwnProperty.call(todoUpdate, key)) {
                if (key in todo) {
                    todo[key] = todoUpdate[key]
                }
            }
        }

        await this.todoRepository.save(todo)

        return todo
    }

    static async delete(todoId: string, userId: string): Promise<void> {
        const todo: IToDo = await this.todoRepository.findOne({
            where: {
                id: todoId
            },
            relations: ["user"]
        })

        if (!todo) {
            throw new AppError("Tarefa nao encontrada", 404)
        }

        if (todo?.user?.id !== userId) {
            throw new AppError("Não autorizado", 401)
        }

        await this.todoRepository.delete(todo)

        return
    }
}

export default ToDoService
