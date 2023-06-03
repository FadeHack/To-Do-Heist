const { ObjectId } = require('mongodb');
const client = require('../index').client;
const jwt = require('jsonwebtoken');


const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasksCollection = client.db('todo').collection('tasks');
      // If user is admin, fetch all tasks
      const tasks = await tasksCollection.find().toArray();
      res.json(tasks);
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getUserTasks: async (req, res) => {
    try {
      const { username } = req.params;
  
      // Access the tasks collection
      const tasksCollection = client.db('todo').collection('tasks');
  
      // Fetch tasks for the specific user
      const tasks = await tasksCollection.find({ username }).toArray();
  
      res.json(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  },  
  
  createTask: async (req, res) => {
    const { title, description, time } = req.body;

    try {
      const token = req.headers.authorization.split(' ')[1];
  
      // Decode the token to get the user ID
      const decodedToken = jwt.verify(token, 'secretKey');
      const userId = decodedToken.userId;
  
      // Access the users collection
      const usersCollection = client.db('todo').collection('users');
  
      // Find the user with the specified ID
      const convertedObjectId = new ObjectId(userId);
      const user = await usersCollection.findOne({ _id: convertedObjectId });

  
      // Access the tasks collection
      const tasksCollection = client.db('todo').collection('tasks');
  
      // Create a new task
      const newTask = {
        title,
        description,
        time: new Date(time),
        username: user.username // Add the username field from the user
      };
  
      await tasksCollection.insertOne(newTask);
  
      res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, time } = req.body;

      // Access the tasks collection
      const tasksCollection = client.db('todo').collection('tasks');

      // Update the task
      const convertedObjectId = new ObjectId(id);
      const result = await tasksCollection.updateOne(
        { _id: convertedObjectId },
        { $set: { title, description, time: new Date(time) } } // Convert time to a Date object
      );

      if (result.modifiedCount === 1) {
        res.json({ message: 'Task updated successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      console.log(error); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      // Access the tasks collection
      const tasksCollection = client.db('todo').collection('tasks');

      // Delete the task
      const convertedObjectId = new ObjectId(id);
      const result = await tasksCollection.deleteOne({ _id: convertedObjectId });

      if (result.deletedCount === 1) {
        res.json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = taskController;
