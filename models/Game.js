const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  img: { type: String },
  desc: { type: String },
  genre: [{ type: String }],
  price: { type: Number, default: 0 },
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
    gameId: { type: Number },
    user: { type: String },
    rating: { type: Number },
    comment: { type: String },
    date: { type: String },
    avatar: { type: String }
  }]
});

module.exports = mongoose.model('Game', gameSchema);
