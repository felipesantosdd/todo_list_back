import { IUser } from "./user.Interfaces"

export interface IToDo {
    id: string
    title: string
    text: string
    color: string
    isFavorited: boolean
    isDone: boolean
    user?: IUser
}

export type INewToDoRequest = Pick<IToDo, "title" | "text">
export type IUpdateToDoRequest = Pick<
    IToDo,
    "title" | "text" | "color" | "isFavorited" | "isDone"
>
