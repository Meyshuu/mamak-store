const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  genre: [{ type: String }],
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  reviews: [{
    gameId: { type: Number },
    user: { type: String },
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date },
    avatar: { type: String }
  }]
});

module.exports = mongoose.model('Game', gameSchema);
