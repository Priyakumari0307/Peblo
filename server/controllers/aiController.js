const aiService = require('../services/aiService');
const Note = require('../models/Note');

// Helper to increment AI usage and update note
const updateNoteAIFields = async (noteId, userId, updateData) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, userId: userId },
    { 
      $set: updateData,
      $inc: { aiUsageCount: 1 }
    },
    { new: true }
  );
};

const handleSummary = async (req, res) => {
  const { noteId, content } = req.body;
  try {
    const summary = await aiService.generateSummary(content);
    const updatedNote = await updateNoteAIFields(noteId, req.user._id, { summary });
    res.json({ summary, updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleActionItems = async (req, res) => {
  const { noteId, content } = req.body;
  try {
    const actionItems = await aiService.extractActionItems(content);
    const updatedNote = await updateNoteAIFields(noteId, req.user._id, { actionItems });
    res.json({ actionItems, updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleTitle = async (req, res) => {
  const { noteId, content } = req.body;
  try {
    const suggestedTitle = await aiService.generateTitle(content);
    const updatedNote = await updateNoteAIFields(noteId, req.user._id, { suggestedTitle });
    res.json({ suggestedTitle, updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleSummary,
  handleActionItems,
  handleTitle,
};
