const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/ShortUrl');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const log = require('../middleware/loggingMiddleware');

// Inside a POST or GET route, when something important happens:
log('backend', 'error', 'handler', 'Shortcode already exists');

// Create short URL
router.post('/shorturls', async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    let code = shortcode || uuidv4().slice(0, 6);
    // Ensure unique shortcode
    let existing = await ShortUrl.findOne({ shortcode: code });
    if (existing) {
      if (!shortcode) {
        code = uuidv4().slice(0, 6);
      } else {
        return res.status(400).json({ error: 'Shortcode already exists' });
      }
    }

    const expiryDate = moment().add(validity, 'minutes').toDate();
    const shortUrl = new ShortUrl({
      url,
      shortcode: code,
      expiry: expiryDate
    });

    await shortUrl.save();

    res.status(201).json({
      shortLink: `http://localhost:3000/${code}`,
      expiry: expiryDate.toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redirect
router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortcode });

    if (!shortUrl) return res.status(404).json({ error: 'Shortcode not found' });
    if (new Date() > shortUrl.expiry) return res.status(410).json({ error: 'Link expired' });

    // Track click
    shortUrl.clicks.push({
      referrer: req.get('Referrer') || '',
      geo: 'IN' // Hardcoded or you can use IP geo lookup
    });
    await shortUrl.save();

    res.redirect(shortUrl.url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stats
router.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortcode });

    if (!shortUrl) return res.status(404).json({ error: 'Shortcode not found' });

    res.json({
      originalUrl: shortUrl.url,
      createdAt: shortUrl.createdAt,
      expiry: shortUrl.expiry,
      totalClicks: shortUrl.clicks.length,
      clicks: shortUrl.clicks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
