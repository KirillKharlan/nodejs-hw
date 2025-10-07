const express = require('express')
const userController = require('./user.controller')
const router = express.Router()
router.get("/users/:id", userController.getUserById)
router.get("/users", userController.getAllUsers)
module.exports = router
