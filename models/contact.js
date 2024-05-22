const mongoose = require('mongoose');
const contactSchema = mongoose.Schema({
    fullname: String, 
    email: String, 
    message: String
})

module.exports = mongoose.model('Contact', contactSchema);