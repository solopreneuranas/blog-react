var mongoose = require('mongoose')
var adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("admin", adminSchema)