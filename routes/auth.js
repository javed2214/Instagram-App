const express = require('express')
const router = express.Router()
const { register, login, logout, loggedIn, getUser, forgotPassword, resetPassword } = require('../controllers/auth')
const { auth } = require('../middleware/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(auth, logout)
router.route('/loggedin').post(loggedIn)
router.route('/getuser').post(auth, getUser)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resetToken').put(resetPassword)

module.exports = router
