const express = require('express');
const router = express.Router();
const { generateUsers } = require('../generate');

// Get all users
router.get('/', (req, res) => {
  const users = generateUsers();
  res.json(users);
});

// Get a specific user by ID
router.get('/:id', (req, res) => {
  const users = generateUsers();
  const user = users.find(user => user.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
