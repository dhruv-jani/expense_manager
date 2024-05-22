const mongoose = require('mongoose');
const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    limit: {
        type: Number,
        require: true
    }, 
    catagories: {
        type: Array,
        default: []
    }
});
module.exports = mongoose.model('expense', expenseSchema);