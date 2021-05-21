const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log('Error in DB Connectivity')
    else console.log('DB Connected Successfully')
})