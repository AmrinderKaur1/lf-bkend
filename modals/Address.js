const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Address = new schema({
    user: {
        // users schema in address
        type: schema.Types.ObjectId,
        ref: 'users'
    },
    fullName: {
        type: String,
        required: true
    },
    mobileNum: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    detailedAddress: {
        type: String,
        required: true
    },
})


module.exports = mongoose.model('addressModel', Address);
