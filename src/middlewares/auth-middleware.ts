import type { NextFunction, Request, Response } from "express"
import type { AuthenticatedUser } from "../User/user.types.ts";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.ts";

export function authMiddleware(req: Request, res: Response<object,{userId: number}>, next: NextFunction){
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: "authorization is required",
        });
        return;
    }
    const [typeToken, token] = authorization.split(" ");
    if (typeToken !== "Bearer" || !token) {
        res.status(401).json({
            message: "invalid authorization. Use Bearer token",
        });
        return;
    }
    try {
        const decodedToken = jwt.verify(token, ENV.SECRET_KEY) as AuthenticatedUser;
        res.locals.userId = decodedToken.id
        next()

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "invalid token",
        });
    }
}

