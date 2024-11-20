require('dotenv').config()
const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const app = express()

//console.log(`Process::`, process.env)
//init middlewares  
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
//init db
require('./dbs/init.mongodb')
//const { checkOverload } = require('./helpers/check.connect')
//checkOverload()

//init routes

//handling error
app.use('/', require('./routes'))

module.exports = app