const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  img: { type: String },
  desc: { type: String },
  genre: [{ type: String }],
  price: { type: Number, required: true },
  releaseDate: { type: String },
  developer: { type: String },
  platform: { type: String },
  rating: { type: Number },
  sysReq: {
    min: { type: String },
    rec: { type: String }
  },
  screenshots: [{ type: String }],
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
