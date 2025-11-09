const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default-avatar.png' },
  balance: { type: Number, default: 0 },
  wishlist: [{ type: Number }],
  library: [{ type: Number }],
  cart: [{ type: Number }],
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
