const express = require('express');
const router = express.Router();
const events = require('../controllers/events');

router.post("/", (req, res) => {
  events.create(req, res);
})

module.exports = router;
