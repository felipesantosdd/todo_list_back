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

    test("POST /users -  Deve ser possivel criar um usuario", async () => {
        const newUser = {
            nome: "felipe",
            email: "feliesantosdd@gmail.com",
            senha: "123456"
        }
        const response = await request(app).post("/users").send(newUser)

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("nome")
        expect(response.body).toHaveProperty("email")
        expect(response.body).toHaveProperty("senha")
        expect(response.status).toBe(201)
    })

    it("POST /users - nao deve ser possivel criar mais de um usuario com o mesmo email", async () => {
        const existingUser = {
            nome: "Usuário Existente",
            email: "teste2@example.com",
            senha: "senha456"
        }

        await request(app).post("/users").send(existingUser)

        const response = await request(app)
            .post("/users")
            .send(existingUser)
            .expect(409)

        expect(response.body.error).toBe("Este email já está sendo usado")
    })
})
