var mongoose = require('mongoose')
var pagesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model("pages", pagesSchema)