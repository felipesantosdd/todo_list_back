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

    it("GET /todos/:id - Deve ser possível buscar um todo pelo seu id", async () => {
        const newTodo = {
            title: "teste1",
            text: "teste1",
        }

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        const response = await request(app)
            .get(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.status).toBe(200)
    })

    it("GET /todos/:id - Não deve ser possível buscar um todo sem estar logado", async () => {
        const newTodo = {
            title: "teste2",
            text: "teste2",
        }

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        const response = await request(app).get(`/todos/${todo.body.id}`)

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })

    it("GET /todos/:id - Não deve ser possível buscar um todo de outro usuário", async () => {
        const newUser2 = {
            nome: "teste",
            email: "teste2@gmail.com",
            senha: "123456",
        }

        await request(app).post("/users").send(newUser2)

        const user2 = await request(app).post("/users/login").send({
            email: newUser2.email,
            senha: newUser2.senha,
        })

        const newTodo = {
            title: "teste3",
            text: "teste3",
        }

        const todo = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        const response = await request(app)
            .get(`/todos/${todo.body.id}`)
            .set("Authorization", `Bearer ${user2.body.token}`)

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })

    it("GET /todos - Deve ser possível buscar apenas os todos do usuário logado", async () => {
        const newUser = {
            nome: "teste5",
            email: "teste5@gmail.com",
            senha: "123456",
        }

        await request(app).post("/users").send(newUser)

        const user = await request(app).post("/users/login").send({
            email: newUser.email,
            senha: newUser.senha,
        })

        const newTodo = {
            title: "teste3",
            text: "teste3",
        }

        await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send(newTodo)

        const response = await request(app)
            .get("/todos") // Corrigido: a rota GET deve ser usada para buscar todos os todos do usuário
            .set("Authorization", `Bearer ${user.body.token}`)

        expect(response.body).toHaveLength(0) // Corrigido: verificar o comprimento da resposta
        expect(response.status).toBe(200)
    })
})
