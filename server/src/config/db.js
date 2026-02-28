const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    // 'todo-db' is your local database name
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-db');
    console.log("MongoDB Connected Locally");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;