import { DataSource } from "typeorm"
import request from "supertest"
import { AppDataSource } from "../../data-source"
import app from "../../app"

describe("/user", () => {
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
        // await AppDataSource.dropDatabase()
        await connection.destroy()
    })

    it("POST /users/login - Deve ser possivel fazer o login", async () => {
        const newUser = {
            nome: "usuario",
            email: "usuario@gmail.com",
            senha: "senha123",
        }

        const user = await request(app).post("/users").send(newUser)
        console.log(user.body)

        const response = await request(app).post("/users/login").send({
            email: "usuario@gmail.com",
            senha: "senha123",
        })

        expect(response.body).toHaveProperty("email")
        expect(response.body).toHaveProperty("nome")
        expect(response.body).toHaveProperty("token")
        expect(response.status).toBe(200)
    })

    it("POST /users/login - Nao deve ser possivel logar com dados incorretos", async () => {
        const newUser = {
            nome: "usuario",
            email: "usuario@gmail.com",
            senha: "senha123",
        }

        const user = await request(app).post("/users").send(newUser)
        console.log(user.body)

        const response = await request(app).post("/users/login").send({
            email: "usuario@gmail.com",
            senha: "outrassenha",
        })

        expect(response.body).toHaveProperty("error")
        expect(response.status).toBe(401)
    })
})
