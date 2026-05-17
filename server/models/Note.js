const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    actionItems: [
      {
        type: String,
      },
    ],
    suggestedTitle: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    aiUsageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
noteSchema.index({ userId: 1 });
noteSchema.index({ shareId: 1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ title: 'text', content: 'text' }); // Text index for search

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
