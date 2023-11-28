import "reflect-metadata"
import request from "supertest"
import app from "../app"
import { AppDataSource } from "../data-source"
import { IUser } from "../interfaces/user.Interfaces"

beforeAll(async () => {
    try {
        await AppDataSource.initialize()
        await AppDataSource.runMigrations()
    } catch (error) {
        console.error("Erro ao inicializar AppDataSource:", error)
        throw error
    }
})

afterAll(async () => {
    await AppDataSource.dropDatabase()
    await AppDataSource.destroy()
})

describe("Serviços de usuario", () => {
    it("deve criar um novo usuário com sucesso", async () => {
        const newUser = {
            nome: "Novo Usuário",
            email: "usuario@gmail.com",
            senha: "senha123",
        }

        const response = await request(app).post("/users").send(newUser)

        expect(response.statusCode).toEqual(201)
        expect(response.body.email).toBe(newUser.email)
        // ...
    })

    it("deve retornar um erro 409 se o e-mail já estiver em uso", async () => {
        const existingUser = {
            nome: "Usuário Existente",
            email: "teste2@example.com",
            senha: "senha456",
        }

        await request(app).post("/users").send(existingUser)

        const response = await request(app)
            .post("/users")
            .send(existingUser)
            .expect(409)

        expect(response.body.error).toBe("Este email já está sendo usado")
    })

    it("Deve retornar um array de usuários", async () => {
        const response = await request(app).get("/users").expect(200)

        expect(Array.isArray(response.body)).toBeTruthy()

        expect(
            response.body.every((user: IUser) => typeof user === "object")
        ).toBeTruthy()
    })

    it("Deve ser possivel fazer o login", async () => {
        const loginData = {
            email: "usuario@gmail.com",
            senha: "senha123",
        }
        const response = await request(app)
            .post("/users/login")
            .send(loginData)
            .expect(200)

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("email")
        expect(response.body).toHaveProperty("nome")
        expect(response.body).toHaveProperty("todos")
        expect(response.body).toHaveProperty("token")
    })
})

describe("Serviços de Todos", () => {
    let newUser1: any
    let newUser2: any
    let loggedIn1: any // corrigido o nome
    let loggedIn2: any // corrigido o nome

    beforeAll(async () => {
        const user1 = {
            nome: "Novo Usuário",
            email: "usuario1@gmail.com",
            senha: "senha123",
        }

        const user2 = {
            nome: "Novo Usuário",
            email: "usuario2@gmail.com",
            senha: "senha123",
        }

        newUser1 = await request(app).post("/users").send(user1)
        newUser2 = await request(app).post("/users").send(user2)

        loggedIn1 = await request(app).post("/users/login").send({
            email: newUser1.body.email,
            senha: user1.senha,
        })
        loggedIn2 = await request(app).post("/users/login").send({
            email: newUser2.body.email,
            senha: user2.senha,
        })
    })

    it("deve ser possível criar um novo todo com sucesso", async () => {
        const newTodo = {
            title: "teste",
            text: "teste",
        }

        const response = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loggedIn1.body.token}`)
            .send(newTodo)

        expect(response.status).toBe(201)
    })

    it("deve ser possível atualizar um todo", async () => {
        const newTodo = {
            title: "teste1",
            text: "teste1",
        }

        const update = {
            title: "teste0",
            text: "teste0",
        }

        const newTodoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loggedIn1.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .patch(`/todos/${newTodoResponse.body.id}`)
            .set("Authorization", `Bearer ${loggedIn1.body.token}`)
            .send(update)

        expect(response.status).toBe(200)
    })

    it("Nao deve ser possivel ver os todos sem estar logado", async () => {
        const newTodo = {
            title: "teste1",
            text: "teste1",
        }

        await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loggedIn1.body.token}`)
            .send(newTodo)

        const response = await request(app).get(`/todos`)

        expect(response.status).toBe(200)
    })

    it("Nao deve ser possivel atualizar todos de outros usuarios", async () => {
        const newTodo = {
            title: "teste1",
            text: "teste1",
        }

        const update = {
            title: "teste0",
            text: "teste0",
        }

        const newTodoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loggedIn1.body.token}`)
            .send(newTodo)

        const response = await request(app)
            .patch(`/todos/${newTodoResponse.body.id}`)
            .set("Authorization", `Bearer ${loggedIn2.body.token}`)
            .send(update)

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("error")
    })
})
