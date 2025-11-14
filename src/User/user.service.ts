import type { IServiceContract } from "./user.types.ts";
import { userRepository } from "./user.repository.ts";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.ts";


export const userService : IServiceContract = {
    createUser: async(data)=>{
        const user = await userRepository.findUserByEmail(data.email)
        if (user){
            return "Error. User already exist!"
        }
        const createdUser = await userRepository.createUser(data)
        if (!createdUser){
            return "Error. User didn`t create!"
        }
        const token = jwt.sign({id: createdUser.id}, ENV.SECRET_KEY, {
            expiresIn: "7d"
        })
        return { token }

    },
    findUserByEmail: async(data)=>{
        const foundedUser = await userRepository.findUserByEmail(data.email)
        if (!foundedUser){
            return "Can't find user!"
        }
        if (!(data.password === foundedUser.password)){
            return "Password is incorrect!"
        }
        const token = jwt.sign({id: foundedUser.id}, ENV.SECRET_KEY, {
            expiresIn: "7d"
        })
        return { token }
    },
    me: async(id)=>{
        const foundedUser = await userRepository.findByIdWithoutPassword(id)
        if (!foundedUser){
            return "Cannot find user"
        }
        return foundedUser
    }
}
