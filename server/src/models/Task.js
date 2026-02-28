const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true }, // Simple ID for multiple users
  comments: [{ 
    text: String, 
    createdAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);