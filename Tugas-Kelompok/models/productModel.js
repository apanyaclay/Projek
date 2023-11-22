const conn = require('../config/db');

function getAll(callback) {
    let sql = "SELECT * FROM `tbl_products`";
    conn.query(sql, (err, result) => {
        if (err) {
            callback(err, null); // Mengirimkan error ke callback
        } else {
            callback(null, result); // Mengirimkan hasil ke callback
        }
    });
}

function addData(data, callback) {
    const values = data
    let sql = "INSERT INTO tbl_products (name, description, price, pictures, id_user) VALUES (?,?,?,?,?)"
    conn.query(sql, values, (err, result) => {
        if (err) {
            callback(err, null); // Mengirimkan error ke callback
        } else {
            callback(null, result); // Mengirimkan hasil ke callback
        }
    })
}

module.exports = { getAll, addData };