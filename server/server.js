const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', require('./src/routes/taskRoutes'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));