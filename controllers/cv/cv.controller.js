const cvService = require("../../repositories/cv.repository");
const { validationResult } = require("express-validator");
const {
  handlerSuccess,
  handlerBadRequestError,
} = require("../../utils/handler.response.util");

function generateCVId() {
  const moment = require("moment");
  return moment().format("YYYYMMDDHHmmss");
}

module.exports = {
  classname: "CVCotroller",

  /**
   * Khởi tạo CV
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns: Trạng thái khởi tạo
   */
  createCurriculumVitae: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }

    try {
      const newCV = {
        _id: generateCVId(),
        status: req.body.status,
        classification: req.body.classification,
        skillScore: req.body.skillScore,
        personalityScrore: req.body.personalityScrore,
        summary: req.body.summary,
        jobApproveStatus: req.body.jobApproveStatus,
        roleApprove: req.body.roleApprove,
        salaryApprove: req.body.salaryApprove,
        durationApprove: req.body.durationApprove,
        guaranteeTime: req.body.guaranteeTime,
        guaranteeNote: req.body.guaranteeNote,
        owner: req.body.owner,
        major: req.body.major,
      };

      const createCV = await cvService.create(newCV);
      return handlerSuccess(req, res, createCV);
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },
};
