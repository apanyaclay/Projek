require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const port = process.env.SERVER_PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
})

conn.connect((err) => {
    if (err) {
        console.log("Database is disconnect")
        console.log(err)
    } else {
        console.log("Database connected successfully")
    }
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return refreshToken
}

function validateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { 
            res.status(403).send("Token invalid")
        } else {
            req.user = user
            next()
        }
    })
}

app.get('/', (req, res) => {
    res.status(200).json({message: "Berhasil"})
    console.log(refreshTokens)
})
app.post('/register', (req, res) => {
    const username = req.query.username
    const email = req.query.email
    const password = bcrypt.hashSync(req.query.password, saltRounds);
    let sql = "INSERT INTO `user` (username, email, password) VALUES (?,?,?)"
    const values = [username, email, password]
    conn.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({status: 500, message: err})
        } else {
            if (result['affectedRows'] === 1) {
                res.status(201).json({status: 201, response: {id: result.insertId, username: username, email: email, password: password}})
            } else {
                res.status(400).json({status: 400, message: "Gagal membuat akun"})
            }
        }
    })
})

app.post('/login', (req, res) => {
    const email = req.query.email
    const password = req.query.password
    let sql = "SELECT * FROM user WHERE email=?"
    const values = [email]
    conn.query(sql, values, (err, result)=> {
        if (err){
            res.status(500).json({status: 500, message: err})
        } else {
            const match = bcrypt.compareSync(password, result[0].password)
            if (match) {
                const accessToken = generateAccessToken({username: result[0].username})
                const refreshToken = generateRefreshToken({username: result[0].username})
                res.status(200).json({status: 200, response: {accessToken: accessToken, refreshToken: refreshToken}})
            } else {
                res.status(401).json({status: 401, message:"Password Incorrect!"})
            }
        }
    })
})

app.get('/api/product', (req, res) => {
   let sql = "SELECT * FROM `tbl_products`"
   conn.query(sql, (err, result)=> {
    if (err) {
        res.status(500).json({status: 500, message: err})
    } else {
        res.status(200).json({status: 200, response: result})
    }
   })
})

app.post('/api/product', validateToken, (req, res) => {
   const values = [ name=req.query.name, description=req.query.description, price=req.query.price, pictures=req.query.pictures, id_user=req.query.id_user]
   let sql = "INSERT INTO tbl_products (name, description, price, pictures, id_user) VALUES (?,?,?,?,?)"
   conn.query(sql, values, (err, result) => {
    if (err) {
        res.status(500).json({status: 500, message: err})
    } else {
        if (result['affectedRows'] === 1) {
            res.status(200).json({status: 200, message: "Berhasil menambahkan produk", response: {id: result.insertId, ...req.query}})
        } else {
            res.status(204).json({status: 204, message: "Gagal menambahkan produk"})
        }
    }
   })
})

app.listen(port, () => {
    console.log(`Running di http://127.0.0.1:${port}`)
})