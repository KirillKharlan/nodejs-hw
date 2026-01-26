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
    login: async(req, res) => {
        const dataUser = req.body;
        const response = await userService.findUserByEmail(dataUser)
        if (response === "Can't find user"){
            res.status(404).json(response)
        }
        res.status(200).json(response)
    },
    me: async(req, res) => {
		const me = await userService.me(res.locals.userId);
        if (typeof me === "string"){
            res.status(404).json("User doesn`t exist!")
            return;
        }
        res.status(200).json(me)
	},
    updateMe: async (req, res) => {
        const userId = res.locals.userId;
        const result = await userService.updateUser(userId, req.body);

        if (typeof result === "string") {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    }
}       
export default userController