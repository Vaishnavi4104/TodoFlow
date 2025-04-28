const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: true });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the task'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: String
  },
  completedAt: {
    type: Date,
    default: null
  },
  subtasks: [subtaskSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema); 