import query from "@database/index";
import { functions, statusCodes, messages } from "@common/helpers";
import _ from "lodash";
import config from "@config";
import fs from "fs";
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
    functions.sendEmail(
      body.email,
      "Welcome to Smart Store",
      emailMessage
    );

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
