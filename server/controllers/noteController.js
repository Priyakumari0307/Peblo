const Note = require('../models/Note');

// @desc    Get all notes for a user with filtering, searching and sorting
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { search, category, tag, sort } = req.query;
    const notes = await Note.findAll(req.user.id, { search, category, tag, sort });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all archived notes
// @route   GET /api/notes/archived
// @access  Private
const getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.findArchived(req.user.id);
    res.json(notes);
  } catch (error) {
    console.error('Error in getArchivedNotes:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  const { title, content, tags, category } = req.body;

  try {
    const note = await Note.create({
      userId: req.user.id,
      title: title || 'Untitled Note',
      content: content || '',
      tags: tags || [],
      category: category || 'General',
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const existing = await Note.findById(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Map camelCase body fields to snake_case for DB
    const fields = {};
    const fieldMap = {
      title: 'title',
      content: 'content',
      summary: 'summary',
      actionItems: 'action_items',
      suggestedTitle: 'suggested_title',
      tags: 'tags',
      category: 'category',
      isArchived: 'is_archived',
      isPublic: 'is_public',
      aiUsageCount: 'ai_usage_count',
    };
    for (const [key, dbKey] of Object.entries(fieldMap)) {
      if (req.body[key] !== undefined) fields[dbKey] = req.body[key];
    }

    const updatedNote = await Note.update(req.params.id, req.user.id, fields);
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.deleteById(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Archive/Restore a note
// @route   PATCH /api/notes/:id/archive
// @access  Private
const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await Note.update(req.params.id, req.user.id, { is_archived: !note.isArchived });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public note by shareId
// @route   GET /api/notes/share/:shareId
// @access  Public
const getPublicNote = async (req, res) => {
  try {
    const note = await Note.findByShareId(req.params.shareId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found or private' });
    }
    res.json({
      ...note,
      userId: { name: note.userName },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle note public status
// @route   PATCH /api/notes/:id/share
// @access  Private
const toggleShare = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await Note.update(req.params.id, req.user.id, { is_public: !note.isPublic });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getArchivedNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  toggleArchive,
  getPublicNote,
  toggleShare,
};
