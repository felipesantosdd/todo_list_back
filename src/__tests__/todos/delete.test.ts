import { DataSource } from "typeorm"
import request from "supertest"
import { AppDataSource } from "../../data-source"
import app from "../../app"

describe("/todos", () => {
    let connection: DataSource

    beforeAll(async () => {
        await AppDataSource.initialize()
            .then((res) => {
                connection = res
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err)
            })
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it("DELETE /todos/:id - Deve ser possivel deletar um todo", async () => {
        const newUser = {
            nome: "teste",
            email: "teste1@gmail.com",
            senha: "123456",
        }

        const newTodo = {
            title: "teste",
            text: "teste",
        }

        await request(app).post("/users").send(newUser)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha,
        })

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .delete(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user.body.token}`)

        expect(response.status).toBe(200)
    })

    it("DELETE /todos/:id - Nao deve ser possivel deletat um todo sem estar logado", async () => {
        const newUser = {
            nome: "teste",
            email: "teste2@gmail.com",
            senha: "123456",
        }

        const newTodo = {
            title: "teste",
            text: "teste",
        }

        await request(app).post("/users").send(newUser)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha,
        })

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo)

        const response = await request(app).delete(`/todos/${todo.body.id}`)

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })

    it("DELETE /todos/:id - Nao deve ser possivel deletat um todo de outro usuario", async () => {
        const newUser = {
            nome: "teste1",
            email: "teste1@gmail.com",
            senha: "123456",
        }
        const newUser2 = {
            nome: "teste1",
            email: "teste2@gmail.com",
            senha: "123456",
        }

        const newTodo = {
            title: "teste3",
            text: "teste",
        }

        await request(app).post("/users").send(newUser)
        await request(app).post("/users").send(newUser2)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha,
        })
        const user2 = await request(app).post("/users/login").send({
            email: newUser2.email,
            senha: newUser2.senha,
        })

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .delete(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user2.body.token}`)

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })
})
