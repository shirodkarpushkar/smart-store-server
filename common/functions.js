import CryptoJS from "crypto-js";
import config from "@config";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
/**
 * Function for Encrypting the data
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
function encryptData(data) {
  var response = CryptoJS.AES.encrypt(data, config.tokenkey);
  return response.toString();
}

/**
 * Function for decrypting the data
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypt data)
 */
function decryptData(data) {
  if (config.bodyEncryption) {
    var decrypted = CryptoJS.AES.decrypt(data, config.cryptokey);
    if (decrypted) {
      var userinfo = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      return userinfo;
    } else {
      return { userinfo: { error: "Please send proper token" } };
    }
  }
  return data;
}
/**
 * Function for encryting the userId with session
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
async function tokenEncrypt(data) {
  var token = await jwt.sign({ data: data }, config.tokenkey, {
    expiresIn: config.tokenExpirationTime,
  }); // Expires in 1 day
  return token;
}

/**
 * Function for decryting the userId with session
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypted data)
 */
async function tokenDecrypt(data) {
  try {
    const decode = await jwt.verify(data, config.tokenkey);
    return decode;
  } catch (error) {
    return error;
  }
}
/**
 * Function for sending email
 * @param {*} data (to, sub)
 * @param {*} return (decrypted data)
 */
async function sendEmail(to, subject, message) {
  // let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    /*    service: "gmail", */
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.SMTPemailAddress,
      pass: config.SMTPPassword,
    },
  });

  let mailOptions = {
    from: config.SMTPSenderEmail,
    to: to,
    subject: subject,
    html: message,
  };

  try {
    const mailDetails = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", mailDetails.messageId);
    return mailDetails;
  } catch (error) {
    console.log("sendEmail -> error", error);
  }
}

module.exports = {
  encryptData,
  decryptData,
  tokenEncrypt,
  tokenDecrypt,
  sendEmail,
};
