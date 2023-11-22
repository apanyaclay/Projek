require('dotenv').config()
const express = require('express')
const port = process.env.SERVER_PORT
const app = express()
const productRouter = require('./routes/product')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const cartRouter = require('./routes/cart')
const commentRouter = require('./routes/comment')

app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use('/api', productRouter)
app.use('/', authRouter)
app.use('/users', usersRouter)
app.use('/cart', cartRouter)
app.use('/comments', commentRouter)

app.listen(port, () => {
    console.log(`Running di http://127.0.0.1:${port}`)
})