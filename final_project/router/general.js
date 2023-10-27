const express = require('express');
const router = express.Router(); // Create a router instance
const books = require('./booksdb.js'); // Import booksdb.js directly
const auth_users = require('./auth_users.js'); // Import auth_users.js directly

// 1. Get the list of books available in the shop
router.get('/', function (req, res) {
  const bookList = Object.values(books);
  res.status(200).json(bookList);
});

// 2. Get book details based on ISBN
router.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// 3. Get book details based on author
router.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message: 'No books found by the specified author' });
  }
});

// 4. Get all books based on title
router.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);
  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message: 'No books found with the specified title' });
  }
});

// 5. Get book reviews
router.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: 'No reviews found for the specified book' });
  }
});

module.exports = router;
