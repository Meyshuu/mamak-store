const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameId: { type: Number, required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
  avatar: { type: String, default: 'default-avatar.png' }
});

module.exports = mongoose.model('Review', reviewSchema);
