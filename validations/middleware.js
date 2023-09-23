const Joi = require('joi');

const middleWare = (schema, property) => {
  return (req, res, next) => {
    const {err} = schema.validate(req[property]);
    const isValid = err === null || err === undefined;

    console.log('err', err)
    console.log('isValid', isValid)
    if (isValid) {
      next();
    } else {
      res.status(422).json(err);
    }
  }
}

module.exports = middleWare;