const express = require('express')
const app = express()
const port = 7000
const cors = require('cors')

const db = require('./3_databases/mysql')
const productRouter = require('./1_routers/products')
db.connect()

app.use(express.json())
app.use(cors())

app.use('/product',productRouter)
app.use('/public' , express.static('public'))
app.get('/',(req,res)=>{
    res.send('<h1>Selamat datang di API File Upload System</h1>')
})

app.listen(port,()=>{
    console.log('server running on port' + port)
})