const aiService = require('../services/aiService');
const Note = require('../models/Note');

// Helper to increment AI usage and update note
const updateNoteAIFields = async (noteId, userId, updateData) => {
  // Increment ai_usage_count
  const currentNote = await Note.findById(noteId, userId);
  const fields = {
    ...updateData,
    ai_usage_count: (currentNote?.aiUsageCount || 0) + 1,
  };
  // Map camelCase to snake_case
  const dbFields = {};
  for (const [key, value] of Object.entries(fields)) {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    dbFields[dbKey] = value;
  }
  return await Note.update(noteId, userId, dbFields);
};

const handleSummary = async (req, res) => {
  const { noteId, content } = req.body;
  try {
    const summary = await aiService.generateSummary(content);
    const updatedNote = await updateNoteAIFields(noteId, req.user.id, { summary });
    res.json({ summary, updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleActionItems = async (req, res) => {
  const { noteId, content } = req.body;
  try {
    const actionItems = await aiService.extractActionItems(content);
    const updatedNote = await updateNoteAIFields(noteId, req.user.id, { actionItems });
    res.json({ actionItems, updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleTitle = async (req, res) => {
  const { noteId, content } = req.body;
  try {
    const suggestedTitle = await aiService.generateTitle(content);
    const updatedNote = await updateNoteAIFields(noteId, req.user.id, { suggestedTitle });
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
