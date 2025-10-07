const path = require('path')
const fs = require('fs')
const fsPromises = require("fs/promises")


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
    getUserById: (userId, fieldsToSelect) => {
        const userFound = users.find(user => user.id === userId);

        if (!userFound) {
            return {
                status: "error",
                statusCode: 404,
                message: `Користувача з ID ${userId} не знайдено.`
            };
        }
        const fList = { ...userFound };
        delete fList.id; 
        const responseObject = {};

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

module.exports = userService;














