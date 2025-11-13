import { IUserRepositoryContract, RegisterInput, User } from "./user.types.ts";
import { client } from "../client/client.ts"
import { Prisma } from "../generated/prisma/index.js";


export const userRepository: IUserRepositoryContract = {
    register: async (data: RegisterInput): Promise<User> => {
        try{
            const createdUser = await client.user.create({
                data: data
            })
            return createdUser
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError){
                if (error.code === "P2024"){
                    console.log("Timed out fetching a new connection from the connection pool")
                }
                if (error.code === "P2000"){
                    console.log("Too long value for field")
                }
                if (error.code === "P2002"){
                    console.log("Unique error")
                }
                if (error.code === "P2005"){
                    console.log("Error with field`s type")
                }
                if (error.code === "P2014"){
                    console.log("Because of it will be errors with relations in future")
                }
                if (error.code === "P2019"){
                    console.log("Entering error")
                }
                
            }
            throw error
        }
    },
    findByEmail: async (email: string) => {
        try{
            const foundedUser = await client.user.findUnique({where: {
                email: email
            }})
            return foundedUser;
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2024"){
                    console.log("Timed out fetching a new connection from the connection pool")
                }
                if (error.code === "P2025"){
                    console.log("An operation failed because it depends on one or more records that were required but not found")
                }
            }
            throw error
        }
    }
}   