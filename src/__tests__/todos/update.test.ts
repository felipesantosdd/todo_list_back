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

    it("PATCH /todos/:id - Deve ser possivel atualizar um todo", async () => {
        const newUser = {
            nome: "user1",
            email: "user1@gmail.com",
            senha: "123456"
        }

        const newTodo = {
            title: "teste1",
            text: "teste1"
        }

        await request(app).post("/users").send(newUser)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        })

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .patch(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user.body.token}`)
            .send({ name: "teste0" })

        expect(response.status).toBe(200)
    })

    it("PATCH /todos/:id - Nao deve ser possivel atualizar um todo sem estar logado", async () => {
        const newUser = {
            nome: "user",
            email: "user2@gmail.com",
            senha: "123456"
        }

        const newTodo = {
            title: "teste2",
            text: "teste2"
        }

        await request(app).post("/users").send(newUser)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        })

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .patch(`/todos/${todo.body.id}`)
            .send({ title: "teste0" })

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })

    it("PATCH /todos/:id - Nao deve ser possivel atualizar um todo de outro usuario", async () => {
        const newUser = {
            nome: "teste3",
            email: "teste3@gmail.com",
            senha: "123456"
        }
        const newUser2 = {
            nome: "teste4",
            email: "teste4@gmail.com",
            senha: "123456"
        }

        const newTodo = {
            title: "teste3",
            text: "teste3"
        }

        await request(app).post("/users").send(newUser)
        await request(app).post("/users").send(newUser2)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha
        })
        const user2 = await request(app).post("/users/login").send({
            email: newUser2.email,
            senha: newUser2.senha
        })

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${user.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .patch(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user2.body.token}`)
            .send({ title: "teste0" })

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })
})
