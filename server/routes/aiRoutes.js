const express = require('express');
const router = express.Router();
const { handleSummary, handleActionItems, handleTitle } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes are protected
router.use(protect);

router.post('/summary', handleSummary);
router.post('/action-items', handleActionItems);
router.post('/title', handleTitle);

module.exports = router;
