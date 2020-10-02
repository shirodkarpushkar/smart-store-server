import express from 'express'
import customers from '@modules/customers/routes'

var app = express()
app.use("/customers", customers);

module.exports = app
