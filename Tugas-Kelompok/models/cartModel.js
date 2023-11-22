const conn = require('../config/db')

function getData(callback) {
    let sql = "SELECT * FROM tbl_cart"
    conn.query(sql, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}

module.exports = {getData}