var mongoose = require('mongoose')
var authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("author", authorSchema)