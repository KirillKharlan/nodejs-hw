import type { IControllerContract } from "./user.types.ts";
import { userService } from "./user.service.ts";


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
    async me(req, res) {
		const me = await userService.me(res.locals.userId);
        if (typeof me === "string"){
            res.status(404).json("User doesn`t exist!")
            return;
        }
        res.status(200).json(me)
	}

}       
export default userController