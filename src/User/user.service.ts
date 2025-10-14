import path from 'path'
import fs from 'fs'
import fsPromises from "fs/promises"
import type{ IUser } from "./user.types.ts";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonUserPath = path.join(__dirname, "../../users.json") 
const users = JSON.parse(fs.readFileSync(jsonUserPath, 'utf-8'))

const userService = {

    // беремо усіх користувачів
    getAllUsers: () => {
        return {
            status: "success",
            data: { allUsers: users }
        };
    },

    //беремо користувача по Id
    getUserById: (userId:number, fieldsToSelect:string | string[]) => {
        const userFound = users.find((user: { id: number }) => user.id === userId);

        if (!userFound) {
            return {
                status: "error",
                statusCode: 404,
                message: `Користувача з ID ${userId} не знайдено.`
            };
        }
        const fList = { ...userFound };
        delete fList.id; 
        const responseObject:any = {};

        if (fieldsToSelect.length === 0) {
            Object.assign(responseObject, fList);
        } else {
            for (const field of fieldsToSelect) {
                if (fList.hasOwnProperty(field)) {
                    responseObject[field] = fList[field];
                }
            }
        }

        return {
            status: "success",
            statusCode: 200,
            data: responseObject
        };
    },

};

export default userService;














