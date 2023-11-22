const express = require('express'),
router = express.Router(),
{getData} = require('../models/usersModel'),
{verifyToken} = require('../middlewares/auth')

router.get('/', verifyToken, function(req, res, next) {
    getData(function(err, result) {
        if (err) {
            res.status(500).json({status: 500, message: err})
        } else {
            res.status(200).json({status: 200, data: result});
        }
    })
})

module.exports = router