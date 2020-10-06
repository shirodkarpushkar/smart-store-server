import { functions, statusCodes, messages } from "@common/helpers";
import query from "@database/index";
import config from "@config";
import fs from "fs";
import validator from "validator";
import _ from "lodash";

async function registration(req, res) {
  var body = _.pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
    "avatar",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "zipcode",
  ]);
  body.password = functions.encryptData(body.password);
  const insertCustomer =
    "INSERT INTO customers (first_name,last_name,email,password,avatar) VALUES (?,?,?,?,?)";
  const insertCustomerAddress =
    "INSERT INTO customer_addresses (customer, address, address2, city, state, zipcode ) VALUES (?, ?, ?, ?, ?, ? )";
  try {
    const insertCustomerResponse = await query(insertCustomer, [
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.avatar,
    ]);

    let customerId = insertCustomerResponse.insertId;
    const insertCustomerAddressResponse = await query(insertCustomerAddress, [
      customerId,
      body.addressLine1,
      body.addressLine2,
      body.city,
      body.state,
      body.zipcode,
    ]);
    let token = await functions.tokenEncrypt(body.email);
    token = Buffer.from(token, "ascii").toString("hex");
    let emailMessage = fs
      .readFileSync("common/EmailTemplate/welcome.html", "utf8")
      .toString();
    emailMessage = emailMessage
      .replace("$fullname", body.firstName)
      .replace("$link", config.emailVerificationLink + token);
    functions.sendEmail(body.email, "Welcome to Smart Store", emailMessage);

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

/**
 * API for email verification
 * @param {*} req (email)
 * @param {*} res (json with success/failure)
 */
async function verifyEmail(req, res) {
  var body = _.pick(req.body, ["token"]);
  try {
    const token = Buffer.from(body.token, "hex").toString("ascii");
    const tokenDecrypt = functions.tokenDecrypt(token);

    const updateQuery =
      "UPDATE customers SET is_email_verified = 1 WHERE email = ?";
    const verifyEmailDetails = await query(updateQuery, [tokenDecrypt.data]);
    return res.json({
      status: {
        code: statusCodes.success,
        message: messages.emailVerificationSuccess,
      },
      result: verifyEmailDetails,
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
 * API for signin
 * @param {*} req (email and password)
 * @param {*} res (json with success/failure)
 */
async function signIn(req, res) {
  var body = _.pick(req.body, ["email", "password"]);
  try {
    if (!validator.isEmail(body.email)) {
      throw {
        statusCode: statusCodes.bad_request,
        message: messages.invalidLoginDetails,
        result: null,
      };
    }
    const getQuery =
      "SELECT customers.id, first_name, last_name, email,images.destination as avatar, password, is_email_verified FROM customers LEFT JOIN  images ON ( customers.avatar = images.id) WHERE email = ?";
    const loginDetails = await query(getQuery, [body.email]);
    if (loginDetails.length <= 0) {
      throw {
        statusCode: statusCodes.bad_request,
        message: messages.invalidLoginDetails,
        result: null,
      };
    }
    const password = functions.decryptData(loginDetails[0].password);
    if (password !== body.password) {
      throw {
        statusCode: statusCodes.bad_request,
        message: messages.invalidLoginDetails,
        result: null,
      };
    }
    if (loginDetails[0].isEmailVerified === 0) {
      throw {
        statusCode: statusCodes.bad_request,
        message: messages.emailVerify,
        result: null,
      };
    }
    const userDetails = {
      firstName: loginDetails[0].first_name,
      lastName: loginDetails[0].last_name,
      email: loginDetails[0].email,
      avatar: loginDetails[0].avatar,
    };
    const token = await functions.tokenEncrypt(userDetails);
    userDetails.token = token;
    return res.json({
      status: {
        code: statusCodes.success,
        message: messages.success,
      },
      result: userDetails,
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
 * API to Change password
 * @param {*} req (old password, token, new password )
 * @param {*} res (json with success/failure)
 */
async function changePassword(req, res) {
  try {
    const sqlSelectQuery = `SELECT password FROM customers WHERE email = ?`;
    const details = await query(sqlSelectQuery, [email]);
    return details;
  } catch (error) {
    throw {
      statusCode: connection_failed,
      message: error.message,
      data: JSON.stringify(error),
    };
  }
}

module.exports = {
  registration,
  verifyEmail,
  changePassword,
  signIn,
};
