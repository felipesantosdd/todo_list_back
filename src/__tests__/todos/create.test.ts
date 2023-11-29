import { DataSource } from "typeorm"
import request from "supertest"
import { AppDataSource } from "../../data-source"
import app from "../../app"

describe("/todos", () => {
    let connection: DataSource
    let userToken: string

    beforeAll(async () => {
        await AppDataSource.initialize()
            .then((res) => {
                connection = res
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err)
            })

        const newUser = {
            nome: "teste",
            email: "teste@gmail.com",
            senha: "123456",
        }

        await request(app).post("/users").send(newUser)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha,
        })

        userToken = user.body.token
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it("POST /todos - Deve ser possível criar um todo", async () => {
        const newTodo = {
            title: "teste1",
            text: "teste1",
        }

        const response = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("user")
        expect(response.body).toHaveProperty("text")
        expect(response.body).toHaveProperty("color")
        expect(response.body).toHaveProperty("isFavorited")
        expect(response.body).toHaveProperty("isDone")
        expect(response.status).toBe(201)
    })

    it("POST /todos - Não deve ser possível criar mais de um todo com o mesmo nome", async () => {
        const newTodo = {
            title: "teste2",
            text: "teste2",
        }

        await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        const response = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(409)
    })

    it("POST /todos - Não deve ser possível criar um todo sem estar logado", async () => {
        const newTodo = {
            title: "teste3",
            text: "teste3",
        }

        const response = await request(app).post("/todos").send(newTodo)

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })
})
