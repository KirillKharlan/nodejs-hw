const userService = require("./user.service");
const userController = {
    
    
    getAllUsers: (req, res) => {
        const responseData = userService.getAllUsers();

        if (responseData.status === 'error') {
            res.status(500).json({ message: responseData.message });
            return;
        }

        res.status(200).json(responseData.data);
    },
    

    getUserById: (req, res) => {
        const usersId = parseInt(req.params.id);
        let fieldsToSelect = [];
        if (req.query.fields) {
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

module.exports = userController;
