const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors nicely
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

module.exports = {
  validate
};
