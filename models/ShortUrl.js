const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  geo: String // Simplified for coarse location
});

const ShortUrlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: [ClickSchema]
});

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);
