const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    const token = req.cookies.token
    try{
        if(!token) return res.status(401).json({ error: 'Unauthorized Access' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return res.status(401).json({ error: 'Unauthorized Access' })
        const user = await User.findById(decoded.id)
        if(!user) return res.status(401).json({ error: 'Unauthorized Access' })
        req.user = user
        next()
    } catch(err){
        res.status(401).json({ error: 'Unauthorized Access' })
    }
}