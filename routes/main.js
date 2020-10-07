import express from 'express'
import customers from '@modules/customers/routes'
import images from "@modules/images/routes";
import products from "@modules/products/routes";

var app = express()
app.use("/customers", customers);
app.use("/images", images);
app.use("/products", products);

module.exports = app
