const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(cors({
    origin: ['*'],
    credentials: true
}))

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', require('./routes/auth'))
app.use('/private', require('./routes/private'))

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/build'))
}

const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
    console.log(`Server is Running at PORT: ${PORT}`)
})