const mongoose = require('mongoose');

const ownerShema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
})
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  owner: ownerShema,
  link: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  likes: [{
    type: String,
    required: true,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
console.log(cardSchema);

module.exports = mongoose.model('card', cardSchema);
