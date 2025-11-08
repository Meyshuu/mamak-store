const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  avatar: { type: String, default: 'default-avatar.png' },
  balance: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  wishlist: [{ type: Number }],
  library: [{ type: Number }],
  cart: [{
    gameId: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.model('User', userSchema);
