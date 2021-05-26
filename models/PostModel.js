const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 500
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    url: {
        type: String,
        default: process.env.DEFAULT_POST_IMAGE
    }
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)