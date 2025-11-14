import { cleanEnv, str } from "envalid"; 

export const ENV = cleanEnv(process.env, {
    SECRET_KEY: str()
})