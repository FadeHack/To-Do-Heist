const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const app = express();
const port = 3000;

app.use(express.json());

const uri = 'mongodb+srv://Temp_User:9BH1EM6p6LWStCxt@mongodatabase.ytbk03l.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    console.log('Connecting to MongoDB');

    // Import routes
    const userRoutes = require('./routes/userRoutes');
    const taskRoutes = require('./routes/taskRoutes');

    // Set up routes
    app.use('/api/users', userRoutes);
    app.use('/api/tasks', taskRoutes);

    // Serve static files from the "public" directory
    app.use(express.static('public'));

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

module.exports = { app, client };
