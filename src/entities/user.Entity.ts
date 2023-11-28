import "reflect-metadata"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import ToDo from "./todo.Entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 60 })
    nome: string

    @Column({ type: "varchar", length: 60 })
    email: string

    @Column({ type: "varchar" })
    senha: string

    @OneToMany(() => ToDo, (todo) => todo.user)
    todos: ToDo[]
}

export default User
