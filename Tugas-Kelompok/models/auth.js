const conn = require('../config/db')

function register(data, callback) {
    let sql = "INSERT INTO `tbl_user` (name, username, password, email, avatar) VALUES (?,?,?,?,?)"
    const values = data
    conn.query(sql, data, (err, result) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}

function login(data, callback) {
    let sql = "SELECT * FROM tbl_user WHERE email=?"
    const values = data
    conn.query(sql, values, (err, result)=> {
        if (err){
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}

module.exports = {register, login}