const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskController');

// Task Routes
router.get('/', taskCtrl.getTasks);
router.post('/', taskCtrl.createTask);
router.put('/:id', taskCtrl.updateTask);
router.delete('/:id', taskCtrl.deleteTask);

// Comment Routes (Nested)
router.post('/:id/comments', taskCtrl.addComment);
router.put('/:taskId/comments/:commentId', taskCtrl.updateComment);
router.delete('/:taskId/comments/:commentId', taskCtrl.deleteComment);

module.exports = router;