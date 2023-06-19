const validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    const errors = {}

    if (!validator.isLength(data.mobileNum, {max: 10, min: 10})) {
        errors.mobileNum = 'Mobile Number must be 10 digit long'
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
} 
