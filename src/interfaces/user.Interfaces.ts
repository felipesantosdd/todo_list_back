import { IToDo } from "./todo.Interface"

export type IUser = {
    id: string
    nome: string
    email: string
    senha: string
    todos: IToDo[]
}

export type INewUserRequest = Pick<IUser, "nome" | "email" | "senha">

export type INewUserResponse = Pick<IUser, "id" | "nome" | "email" | "todos">

export type ILoginRequest = Pick<IUser, "email" | "senha">

export type ILoginResponse = Pick<IUser, "id" | "nome" | "email" | "todos"> & {
    token: string
}
