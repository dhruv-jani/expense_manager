const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/expenseManager");
const userSchema = new Schema({
  usedBudget: {
    type: Number, 
    default: 0
  },
  limit: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  }, 
  email: {
    type: String,
    required: true,
    unique: true
  }, 
  fullname: {
    type: String,
    require: true
  },
  expenses: {
    type: Array,
    default: []
  }
});
userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);