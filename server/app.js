require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/', require('./routes'))

app.listen(port, () => {
    console.log(process.env.CLIENT_ID)
    console.log('listening on port', port)
})