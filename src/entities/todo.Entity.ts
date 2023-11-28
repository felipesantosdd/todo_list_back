import "reflect-metadata"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import User from "./user.Entity"

@Entity()
export class ToDo {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 60 })
    title: string

    @Column({ type: "varchar", length: 60 })
    text: string

    @Column({ type: "varchar", default: "#1877F2" })
    color: string

    @Column({ type: "boolean", default: false })
    isFavorited: boolean

    @Column({ type: "boolean", default: false })
    isDone: boolean

    @ManyToOne(() => User, (user) => user.todos)
    user: User
}

export default ToDo
