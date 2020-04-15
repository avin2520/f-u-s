const mysql = require('mysql')
const dotenv =require('dotenv')
dotenv.config()

const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : 3306,
    database : process.env.DB_NAME,
    password : process.env.DB_PASS
})

module.exports = db