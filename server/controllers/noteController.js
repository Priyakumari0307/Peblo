const Note = require('../models/Note');

// @desc    Get all notes for a user with filtering, searching and sorting
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { search, category, tag, sort } = req.query;
    let query = { userId: req.user._id, isArchived: false };

    // Search functionality (Title and Content)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filtering
    if (category && category !== 'All') {
      query.category = category;
    }

    // Tag filtering
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Sorting logic
    let sortOptions = { updatedAt: -1 }; // Default: Latest updated
    if (sort === 'oldest') sortOptions = { updatedAt: 1 };
    if (sort === 'alphabetical') sortOptions = { title: 1 };
    if (sort === 'alphabetical-desc') sortOptions = { title: -1 };

    const notes = await Note.find(query).sort(sortOptions);
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
    console.log('Fetching archived notes for user:', req.user._id);
    const notes = await Note.find({ userId: req.user._id, isArchived: true }).sort({ updatedAt: -1 });
    console.log(`Found ${notes.length} archived notes`);
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
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
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
      userId: req.user._id,
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
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

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
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();
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
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public note by shareId
// @route   GET /api/notes/share/:shareId
// @access  Public
const getPublicNote = async (req, res) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true })
      .populate('userId', 'name');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or private' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle note public status
// @route   PATCH /api/notes/:id/share
// @access  Private
const toggleShare = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isPublic = !note.isPublic;
    await note.save();

    res.json(note);
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
