var db = require("../../database/dbConnect");
var functions = require("../../common/functions");
var _ = require("lodash");
var statusCodes = require("../../common/statusCode");
var messages = require("../../common/message");
async function registration(req, res) {
  var body = _.pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
    "avatar",
  ]);
  body.password = functions.encryptData(body.password);
  const queryStatement =
    "INSERT INTO customers (first_name,last_name,email,password,avatar) VALUES (?,?,?,?,?)";
  try {
    const response = await db.query(queryStatement, [
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.avatar,
    ]);
    return res.json({
      status: {
        code: statusCodes.success,
        message: messages.registration,
      },
    });
  } catch (err) {
    if (err) {
      return res.json({
        status: {
          code: statusCodes.bad_request,
          message: messages.badRequest,
        },
      });
    }
  }
}

module.exports = {
  registration,
};
