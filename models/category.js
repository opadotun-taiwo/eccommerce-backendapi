const mongoose = require('mongoose')

// Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    },
})

// export Model
module.exports = mongoose.model('Category', categorySchema)
