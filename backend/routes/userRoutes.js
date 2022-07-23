const express = require('express')
const router = express.Router()
const {registerUser,loginUser} = require('./controller/userController')
const expressFormidable = require('express-formidable')

router.post('/signup',registerUser)
router.post('/login',loginUser)



module.exports = router

