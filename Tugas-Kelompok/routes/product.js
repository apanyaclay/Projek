const express = require('express'),
router = express.Router(),
{verifyToken} = require('../middlewares/auth'),
{getAll, addData} = require('../models/productModel');

router.get('/product', verifyToken, function(req, res, next) {
    getAll(function(err, result) {
        if (err) {
            res.status(500).json({ status: 500, message: 'Error saat mengambil data dari database' });
        } else {
            res.status(200).json(result);
        }
    });
})

router.post('/product', verifyToken, function(req, res, next) {
    const data = [ name=req.query.name, description=req.query.description, price=req.query.price, pictures=req.query.pictures, id_user=req.query.id_user]
    addData(data, function(err, result) {
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

module.exports = router