const User = require('../models/UserModel')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendEmail } = require('../utils/sendEmail')

const validateRegisterUser = (user) => {
    const JoiSchema = Joi.object({
        username: Joi.string().min(4).max(40).required(),
        email: Joi.string().min(10).max(100).required().email(),
        password: Joi.string().min(6).max(100).required()
    })
    return JoiSchema.validate(user)
}

const validateLoginUser = (user) => {
    const JoiSchema = Joi.object({
        email: Joi.string().min(10).max(100).required().email(),
        password: Joi.string().min(6).max(100).required()
    })
    return JoiSchema.validate(user)
}

const validateResetPassword = (password) => {
    const JoiSchema = Joi.object({
        password: Joi.string().min(6).max(100).required()
    })
    return JoiSchema.validate(password)
}

exports.register = async (req, res) => {  
    const { username, email, password, confirmPassword } = req.body
    try{
        if(!username || !email || !password || !confirmPassword) return res.json({ error: 'Please fill all the Fields' })
        if(password !== confirmPassword) return res.json({ error: 'Password didn\'t Match' })
        const { error } = validateRegisterUser({ username, email, password })
        if(error) return res.json({ error: error.details[0].message })
        var user = await User.findOne({ email })
        if(user) return res.json({ error: 'User already Exists' })
        user = await User.create({ username, email, password })
        res.status(201).json({
            success: true,
            user
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try{
        if(!email || !password) return res.json({ error: 'Please fill all the Fields' })
        const { error } = validateLoginUser(req.body)
        if(error) return res.json({ error: error.details[0].message })
        var user = await User.findOne({ email })
        if(!user) return res.json({ error: 'Invalid Credentials' })
        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.json({ error: 'Invalid Credentials' })
        const token = await user.getSignedToken()
        res.cookie('token', token, {
            httpOnly: true
        }).json({
            success: true,
            token
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.logout = (req, res) => {
    try{
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        }).json({
            success: true,
            message: 'You are Logged Out'
        })
    } catch(err){
        res.json({
            success: false,
            error: 'Error in Logging Out'
        })
    }
}

exports.loggedIn = async (req, res) => {
    try{
        const token = req.cookies.token
        if(!token) return res.json(false)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user) return res.json(false)
        res.json(true)
    } catch(err){
        res.json(false)
    }
}

exports.getUser = async (req, res) => {
    try{
        const user = req.user
        if(!user) return res.json({ error: 'No User found' })
        res.status(200).json({
            success: true,
            user
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        const resetToken = crypto.randomBytes(30).toString('hex')
        const hash = crypto.createHash('sha256').update(resetToken).digest('hex')
        
        const { email } = req.body

        if(!email) return res.json({ error: 'Please provide an Email ID' })

        var user = await User.findOne({ email })

        if(!user) return res.json({ error: 'Invalid Email ID' })

        user = await User.findByIdAndUpdate(user.id, {
            resetPasswordToken: hash,
            resetPasswordExpire: Date.now() + 10 * (60 * 1000)   // Ten Minutes
        })

        // const resetURL = `${req.protocol}://localhost:3000/auth/resetpassword/${hash}`

        const resetURL = `${req.protocol}://${req.get('host')}/auth/resetpassword/${hash}`;

        const message = `
            You requested to reset the Password. <br />
            Please click on the link below to reset your Password. <br /><br />
            <b>Password Reset URL</b> <br/> <a href="${resetURL}" target="_blank" >${resetURL}</a><br /><br />
            <b>NOTE: </b>The Link is Valid for 10 mins.<br /><br />
            Thanks! <br /><br /><br />
            Regards<br />
            Instagram 2.0<br /><br />
            <img src="https://firebasestorage.googleapis.com/v0/b/blog-app-8547b.appspot.com/o/insta2.0.png?alt=media&token=724b90a0-4276-4674-8a2e-31b447bf8b4c">
        `

        sendEmail(email, 'Reset Instagram 2.0 Password', message)

        res.json({
            success: true,
            message: 'Email Sent'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.resetPassword = async (req, res) => {
    try{
        const resetPasswordToken = req.params.resetToken
        const { newPassword, confirmNewPassword } = req.body

        if(!newPassword || !confirmNewPassword) return res.json({ error: 'Please fill all the Fields' })
        if(newPassword !== confirmNewPassword) return res.json({ error: 'Password didn\'t Match' })

        const { error } = validateResetPassword({ password: newPassword })
        if(error) return res.json({ error: error.details[0].message })

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        
        if(!user) return res.json({ error: 'Token is Invalid or has Expired!' })
        
        user.password = newPassword

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        res.json({
            success: true,
            message: 'Password Reset Successfull'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Access Denied'
        })
    }
}
