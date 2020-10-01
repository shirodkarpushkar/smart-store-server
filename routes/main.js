var express= require('express')
var customers = require('../modules/customers/routes')

var app = express()
app.use("/customers", customers);

module.exports = app
