const express = require('express');
const { connectDB } = require('./database/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
