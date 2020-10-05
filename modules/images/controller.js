import db from "@database/dbConnect";
import { functions, statusCodes, messages } from "@common/helpers";
import _ from "lodash";

async function uploadImage(req, res) {
  try {
    if (req.file) {
      res.json(req.file);
    }
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
  uploadImage,
};
