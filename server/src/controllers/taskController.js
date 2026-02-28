const Task = require('../models/Task');

// ✅ TASK CRUD
exports.getTasks = async (req, res) => {
  try {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    let tasks = await Task.find({ userId: req.query.userId });
    // This sorting logic covers your exam requirement for Priority and Name sorting
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.title.localeCompare(b.title));
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ✅ COMMENT CRUD
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.comments.push({ text: req.body.text });
    await task.save();
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const task = await Task.findById(taskId);
    const comment = task.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    comment.text = req.body.text;
    await task.save();
    res.json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.comments.pull(commentId);  
    await task.save();
    res.json({ message: "Comment deleted", task });
  } catch (err) { res.status(500).json({ error: err.message }); }
};