var mongoose = require('mongoose')
var subscribersSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("subscribers", subscribersSchema)