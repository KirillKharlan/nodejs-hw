import type { Request, Response } from 'express'
import userService from "./user.service.ts";
const userController = {
    
    // беремо усіх користувачів
    getAllUsers: (req:Request, res:Response) => {
        const responseData = userService.getAllUsers();

        if (responseData.status === 'error') {
            res.status(500).json({ message: responseData.data });
            return;
        }

        res.status(200).json(responseData.data);
    },
    
    // Беремо користувача по id
    getUserById: (req:Request, res:Response) => {
        const userIdParams = req.params.id;
        if (userIdParams === undefined) {
            res.status(400).send({ message:"idParams undefined"});
            return;
        }
        const usersId = parseInt(userIdParams);
        let fieldsToSelect: string | string[]= [];
        // гарантуємо що тип данних string
        if (req.query.fields && typeof req.query.fields === 'string') {
            fieldsToSelect = req.query.fields
                .split(',')
                .map(field => field.trim())
                .filter(field => field.length > 0);
        }
        const responseData = userService.getUserById(usersId, fieldsToSelect);

        if (responseData.status === 'error') {
            res.status(responseData.statusCode).send({ error: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    }
};

export default userController;
