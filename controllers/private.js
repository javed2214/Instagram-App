const User = require('../models/UserModel')
const Post = require('../models/PostModel')
const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const validateRegisterUser = (user) => {
    const JoiSchema = Joi.object({
        username: Joi.string().min(4).max(10).required(),
        email: Joi.string().min(10).max(30).required().email(),
        password: Joi.string().min(6).max(100).required()
    })
    return JoiSchema.validate(user)
}

const validatePost = (user) => {
    const JoiSchema = Joi.object({
        title: Joi.string().min(6).max(100).required(),
        content: Joi.string().min(20).max(500).required()
    })
    return JoiSchema.validate(user)
}

exports.home = (req, res) => {
    res.json({ message: 'you got access to private route' })
}

exports.createPost = async (req, res) => {
    const { title, content } = req.body
    try{
        if(!title || !content) return res.json({ error: 'Please fill all the Fields' })
        const { error } = validatePost({ title, content })
        if(error) return res.json({ error: error.details[0].message })
        const user = req.user
        user.password = undefined
        if(!user) return res.json({ error: 'Unauthorized Access' })
        const post = await Post.create({ title, content, user })
        res.status(201).json({
            success: true,
            post
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server'
        })
    }
}

exports.deletePost = async (req, res) => {
    try{
        const id = req.params.id
        const post = await Post.findByIdAndRemove(id)
        return res.status(200).json({
            success: true,
            message: 'Post Deleted'
        })
    } catch(err){
        res.json({
            success: false,
            error: 'Error in Deleting Post'
        })
    }
}

exports.getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate('user', 'username email url followers following')
        res.status(200).json({
            success: true,
            posts
        })
    } catch(err){
        res.json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.getUserPost = async (req, res) => {
    const user = req.body.user
    if(!user) return res.json({ error: 'Unauthorized Access' })
    try{
        const posts = await Post.find({ user }).populate('user', 'username email url followers following')
        res.status(200).json({
            success: true,
            posts
        })
    } catch(err){
        res.status(401).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.likePost = async (req, res) => {
    const id = req.params.id
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $push: { likes: req.user._id }
        }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Post Liked!'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.unlikePost = async (req, res) => {
    const id = req.params.id
    try{
        const post = await Post.findByIdAndUpdate(id, {
            $pull: { likes: req.user._id }
        }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Post Unliked!'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.addFavourite = async (req, res) => {
    const id = req.params.id
    try{
        const post = await Post.findByIdAndUpdate(id, {
            $push: { favourites: req.user._id }
        }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Post Added to Your Favourite'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.removeFavourite = async (req, res) => {
    const id = req.params.id
    try{
        const post = await Post.findByIdAndUpdate(id, {
            $pull: { favourites: req.user._id }
        }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Post Removed from Your Favourite'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.getFavourites = async (req, res) => {
    const user = req.user
    const id = user._id
    try{
        const posts = await  Post.find( { 'favourites': mongoose.Types.ObjectId(id) } ).populate('user', 'username email url followers following')
        res.status(200).json({
            success: true,
            posts
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.updateProfile = async (req, res) => {
    const id = req.params.id
    try{
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password
        var confirmPassword = req.body.confirmPassword
        if(!username || !email || !password || !confirmPassword) return res.json({ error: 'Please fill all the Fields' })
        var isUser = await User.findOne({ email })
        if(isUser) return res.json({ error: 'Email is already in Use' })
        if(password !== confirmPassword) return res.json({ error: 'Password didn\'t Match' })
        const { error } = validateRegisterUser({ username, email, password })
        if(error) return res.json({ error: error.details[0].message })
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(req.body.password, salt)
        const user = await User.findByIdAndUpdate({ _id: id }, { username: username, email: email, password: password }, { new: true })
        res.status(200).json({
            success: true,
            user
        })
    } catch(err){   
        res.json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.uploadProfile = async (req, res) => {
    const url = req.body.url
    try{
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { url: url }, { new: true })
        res.json({ 
            success: true,
            message: 'File Uploaded Successfully!' 
        })
    } catch(err){
        res.json({ 
            success: false,
            error: 'Error Occurred in Uploading!' 
        })
    }
}

exports.uploadImage = async (req, res) => {
    const url = req.body.url
    const id = req.body.id
    try{
        const post = await Post.findOneAndUpdate({ _id: id }, { url: url }, { new: true })
        res.json({
            success: true, 
            message: 'File Uploaded Successfully!' 
        })
    } catch(err){
        res.json({
            success: false,
            error: 'Error Occurred in Uploading!'
        })
    }
}

exports.updatePost = async (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const content = req.body.content
    try{
        const post = await Post.findOneAndUpdate({ _id: id }, { title, content }, { new: true })
        res.status(200).json({
            success: true,
            post
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.userFollow = async (req, res) => {
    const id = req.params.id
    try{
        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: { following: id }
        }, { new: true })

        const userProfile = await User.findByIdAndUpdate(id, {
            $push: { followers: req.user._id }
        }, { new: true })

        res.status(200).json({
            success: true,
            message: 'User Follwed!',
            userProfile
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.userUnFollow = async (req, res) => {
    const id = req.params.id
    try{
        const user = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: id }
        }, { new: true })

        const userProfile = await User.findByIdAndUpdate(id, {
            $pull: { followers: req.user._id }
        }, { new: true })

        res.status(200).json({
            success: true,
            message: 'User Unfollowed!',
            userProfile
        })
    } catch(err){
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find()
        res.json({
            success: true,
            users
        })
    } catch(err){
        res.json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}