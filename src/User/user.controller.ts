import type { IControllerContract } from "./user.types.ts";
import { userService } from "./user.service.ts";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.ts";


export const userController: IControllerContract = {
    register: async(req, res) => {
        const dataUser = req.body
        const response = await userService.createUser(dataUser)
        if (response === "Error. User didn`t create"){
            res.status(400).json(response)
        }
        res.status(200).json(response)
    },
    login: async(req, res)=> {
        const dataUser = req.body;
        const response = await userService.findUserByEmail(dataUser)
        if (response === "Can't find user"){
            res.status(404).json(response)
        }
        res.status(200).json(response)
    },
    me: async(req, res) => {
        const headers = req.headers.authorization
        if (!headers){
            res.status(401).json("Authorization is required!");
            return;
        }
        const [ typeToken, token ] = headers.split(" ");
        console.log()
        if (typeToken !== "Bearer" || !token){
            res.status(401).json("Invalid authorization!");
            return;
        }
        try{
            const decodedToken = jwt.verify(token, ENV.SECRET_KEY) as {id: number}
            const me = await userService.me(decodedToken.id)
            if (typeof me === "string"){
                res.status(404).json("User doesn`t exist!")
                return;
            }
            res.status(200).json(me)
        }catch(error){
            res.status(400).json("Error when decoding token")
        }

    }
}
export default userController