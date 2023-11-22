const mysql = require('mysql2')

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

module.exports = conn