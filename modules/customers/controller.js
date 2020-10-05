import db from "@database/dbConnect";
import { functions, statusCodes, messages } from "@common/helpers";
import _ from 'lodash'
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
    const insertCustomerResponse = await new Promise((resolve, reject) => {
      db.query(
        insertCustomer,
        [body.firstName, body.lastName, body.email, body.password, body.avatar],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
    let customerId = insertCustomerResponse.insertId;
    const insertCustomerAddressResponse = await new Promise(
      (resolve, reject) => {
        db.query(
          insertCustomerAddress,
          [
            customerId,
            body.addressLine1,
            body.addressLine2,
            body.city,
            body.state,
            body.zipcode,
          ],
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          }
        );
      }
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
