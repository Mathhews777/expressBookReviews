const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const books = require('./booksdb.js'); // Import booksdb.js directly
const users = require('./usersdb'); // Import the users array from usersd

// 1. Login as a registered user
router.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    // Create a JWT token for the user
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// 2. Add or modify a book review
router.put('/review/:isbn', function (req, res) {
  const username = req.user.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    res.status(400).json({ message: 'Review is required' });
    return;
  }

  if (!books[isbn]) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = [];
  }

  const existingReview = books[isbn].reviews.find((r) => r.username === username);

  if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
  } else {
    // Add a new review
    books[isbn].reviews.push({ username, review });
  }

  res.status(200).json({ message: 'Review added/modified successfully' });
});

// 3. Delete a book review
router.delete('/review/:isbn', function (req, res) {
  const username = req.user.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  if (!books[isbn].reviews) {
    res.status(404).json({ message: 'No reviews found for the specified book' });
    return;
  }

  const index = books[isbn].reviews.findIndex((r) => r.username === username);

  if (index === -1) {
    res.status(404).json({ message: 'Review not found' });
  } else {
    // Delete the review
    books[isbn].reviews.splice(index, 1);
    res.status(200).json({ message: 'Review deleted successfully' });
  }
});


module.exports = router;
