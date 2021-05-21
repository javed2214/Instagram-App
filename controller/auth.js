const User = require('../models/UserModel')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')

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
        if(!email || !password) return res.json({ message: 'Please fill all the Fields' })
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