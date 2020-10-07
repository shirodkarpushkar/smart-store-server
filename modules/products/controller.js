
import {  statusCodes, messages } from "@common/helpers";
import query from "@database/index";
import _ from "lodash";



/**
 * API for getting products
 * @param {*} req (registration details)
 * @param {*} res (json with success/failure)
 */
async function getAllProducts(req, res) {
  try {
    const sqlQuery = "call getAllProducts()";
    const getDetails = await query(sqlQuery);
    return res.json({
      status: {
        code: statusCodes.success,
        message: messages.success,
      },
      result: getDetails[0],
    });
  } catch (error) {
    return res.json({
      status: {
        code: error.statusCode,
        message: error.message,
      },
      result: JSON.stringify(error),
    });
  }
}
/**
 * API for getting products
 * @param {*} req (registration details)
 * @param {*} res (json with success/failure)
 */
async function getProductById(req, res) {
  try {
    const productId = parseInt(req.params.id,10);
    const sqlQuery = "call getProductById(?)";
    const getDetails = await query(sqlQuery, [productId]);
    return res.json({
      status: {
        code: statusCodes.success,
        message: messages.success,
      },
      result: getDetails[0][0],
    });
  } catch (error) {
    return res.json({
      status: {
        code: error.statusCode,
        message: error.message,
      },
      result: JSON.stringify(error),
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
};