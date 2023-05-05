const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const router = require('./routes/myRouter')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({secret:'mysession',resave:false,saveUnintialized:false}))
app.use(router)
app.use(express.static(path.join(__dirname,'public')))


app.listen(8080,()=>{
    console.log('run server port 8080')
})