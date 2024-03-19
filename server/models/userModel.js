const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  name: { type: String},
  lastname: { type: String },
  email: { type: String },
  password: {type: String},
  pin: {type: String},
  country: {type: String},
  fechaNacimiento: {type: Date}
});

module.exports = mongoose.model('users', user);