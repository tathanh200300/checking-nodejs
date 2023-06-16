const jdService = require("../../repositories/jd.repository");
const { validationResult } = require("express-validator");
const {
  handlerSuccess,
  handlerBadRequestError,
} = require("../../utils/handler.response.util");

function generateJDId() {
  const moment = require("moment");
  return moment().format("YYYYMMDDHHmmss");
}

module.exports = {
  classname: "JDController",

  createJobDescription: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }

    try {
      const newJD = {
        _id: generateJDId(),
        customerID: req.body.customerID,
        jobName: req.body.jobName,
        experimence: req.body.experimence,
        companyName: req.body.companyName,
        location: req.body.location,
        salary: req.body.salary,
        description: req.body.description,
        requiremences: req.body.requiremences,
        CVMatched: req.body.CVMatched,
        status: req.body.status,
        guarantee: req.body.guarantee,
        benefits: req.body.benefits,
      };

      const createJD = await jdService.create(newJD);
      return handlerSuccess(req, res, createJD);
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },
};
