const { validationResult } = require('express-validator');

// Express middleware: short-circuits with 400 if any validator failed.
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      msg: 'Invalid input',
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
}

module.exports = { handleValidation };
