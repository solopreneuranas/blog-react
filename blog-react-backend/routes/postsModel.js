var mongoose = require('mongoose')
var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    tags: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authors",
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    poster: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("post", postSchema)