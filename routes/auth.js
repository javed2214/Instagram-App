const express = require('express')
const router = express.Router()
const { register, login, logout, loggedIn, getUser } = require('../controllers/auth')
const { auth } = require('../middleware/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/loggedin').post(loggedIn)
router.route('/getuser').post(auth, getUser)

module.exports = router