import express from 'express'
import customers from '@modules/customers/routes'
import images from "@modules/images/routes";

var app = express()
app.use("/customers", customers);
app.use("/images", images);

module.exports = app
