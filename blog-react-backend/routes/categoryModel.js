var mongoose = require('mongoose')
var categorySchema = mongoose.Schema({
    categoryname: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("category", categorySchema)