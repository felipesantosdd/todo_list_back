import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"

async function isAuthenticated(
    request: Request | any,
    response: Response,
    next: NextFunction
) {
    let token = request.headers.authorization

    if (!token) {
        return response.status(401).json({
            message: "Não autorizado",
        })
    }

    token = token.split(" ")[1]

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded: any) => {
        if (error) {
            if (error.name === "TokenExpiredError") {
                return response.status(401).json({
                    message: "Sessão invalálida.",
                })
            } else {
                return response.status(401).json({
                    message: error.message,
                })
            }
        }

        request.user = {
            id: decoded.sub as string,
            email: decoded.email,
        }

        return next()
    })
}

export default isAuthenticated
