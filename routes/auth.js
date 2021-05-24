const express = require('express')
const router = express.Router()
const { register, login, logout, loggedIn, getUser, forgotPassword } = require('../controllers/auth')
const { auth } = require('../middleware/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/loggedin').post(loggedIn)
router.route('/getuser').post(auth, getUser)
router.route('/forgotpassword').post(forgotPassword)

module.exports = router