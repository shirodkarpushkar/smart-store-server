
import {  statusCodes, messages } from "@common/helpers";
import query from "@database/index";
import _ from "lodash";



/**
 * API for email verification
 * @param {*} req (registration details)
 * @param {*} res (json with success/failure)
 */
async function getAllProducts(req, res) {
  try {
    const email = res.locals.tokenInfo.email;
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

module.exports = {
  getAllProducts,
};