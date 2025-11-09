const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  genre: [{ type: String }],
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  reviews: [{
    gameId: Number,
    user: String,
    rating: Number,
    comment: String,
    date: Date,
    avatar: String
  }]
});

module.exports = mongoose.model('Game', gameSchema);
