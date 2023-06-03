const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const client = require('../index').client;

const userController = {
  login: async (req, res) => {
    try {
      const { username, password} = req.body;

      // Access the users collection
      const usersCollection = client.db('todo').collection('users');

      // Find the user with the specified username
      const user = await usersCollection.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = (password === user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user._id }, 'secretKey');
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getUserDetails: async (req, res) => {
    
    try {
      // Retrieve the token from the request headers
      const token = req.headers.authorization.split(' ')[1];

      // Decode the token to get the user ID
      const decodedToken = jwt.verify(token, 'secretKey');
      const userId = decodedToken.userId;

      // Access the users collection
      const usersCollection = client.db('todo').collection('users');

      // Find the user with the specified ID
      const convertedObjectId = new ObjectId(userId);

      const user = await usersCollection.findOne({ _id: convertedObjectId});

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
 
      // Return the user details
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      // Access the users collection
      const usersCollection = client.db('todo').collection('users');
  
      const existingUser = await usersCollection.findOne({ username });
      console.log(existingUser);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      const newUser = {
        username: username,
        password: password,
        role: role
      };
      console.log(newUser);
      await usersCollection.insertOne(newUser);



      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = userController;
