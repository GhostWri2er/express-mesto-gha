const mongoose = require('mongoose');

const ownerShema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  },
});
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
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
