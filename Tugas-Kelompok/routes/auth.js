const express = require('express'),
router = express.Router(),
bcrypt = require('bcrypt'),
saltRounds = 10,
{register, login} = require('../models/auth'),
{generateAccessToken, generateRefreshToken, refreshTokens} = require('../helpers/jwt')

router.post('/register', function(req, res ,next) {
    const {name, username, email, avatar} = req.query
    const password = bcrypt.hashSync(req.query.password, saltRounds)
    if (!username || !name) {
        return res.status(400).json({status:400, error: 'Name or Username are required' });
    }
    if (!email) {
        return res.status(400).json({status:400, error: 'Email are required'})
    }
    if (!password) {
        return res.status(400).json({status:400, error: 'Password are required'})
    }
    if (!avatar) {
        return res.status(400).json({status:400, error: 'Avatar are required'})
    }
    const data = [name, username, password, email, avatar]
    register(data, function(err, result) {
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

router.post('/login', function(req, res, next) {
    const {email, password} = req.query
    if (!email) {
        return res.status(400).json({status:400, error: 'Email are required'})
    }
    if (!password) {
        return res.status(400).json({status:400, error: 'Password are required'})
    }
    login(email, function(err, result) {
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

router.get('/', function(req, res, next) {
    res.json(refreshTokens)
})

router.delete('/logout', function(req, res, next) {
    s = refreshTokens.filter((c) => c != req.query.refreshToken)
    console.log(s)
    res.status(200).json("Logged out!")
})

module.exports = router