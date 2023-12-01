import "reflect-metadata"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import User from "./user.Entity"

@Entity()
export class ToDo {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 60, nullable: true })
    title: string

    @Column({ type: "varchar", length: 600, nullable: true })
    text: string

    @Column({ type: "varchar", default: "##FFFFFF" })
    color: string

    @Column({ type: "boolean", default: false })
    isFavorited: boolean

    @ManyToOne(() => User, (user) => user.todos)
    user: User
}

export default ToDo
