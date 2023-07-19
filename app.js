const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const jwt = require('./helper/jwt')
const errorHandler = require('./helper/error-handler')

app.use(cors())
app.options('*', cors())

// Middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(jwt.authJwt())
app.use(errorHandler)
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

const productsRouter = require('./routers/products')
const usersRouter = require('./routers/users')
const ordersRouter = require('./routers/orders')
const categoriesRouter = require('./routers/categories')

// Primary API in env
const api = process.env.API_URL

// Routers
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, ordersRouter)
app.use(`${api}/categories`, categoriesRouter)

// Database connection
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eshop-database',
    })
    .then(() => {
        console.log('Connection is established...')
    })
    .catch((err) => {
        console.log(err)
    })

const port = 3000

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
