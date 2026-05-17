const express = require('express');
const router = express.Router();
const { 
  getNotes, 
  getArchivedNotes,
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote, 
  toggleArchive,
  getPublicNote,
  toggleShare
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// Public route for shared notes
router.get('/share/:shareId', getPublicNote);

// All other routes are protected
router.use(protect);

router.get('/archived', getArchivedNotes);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.patch('/:id/archive', toggleArchive);
router.patch('/:id/share', toggleShare);

module.exports = router;
