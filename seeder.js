const { Book } = require('./models/Book');
const { Author } = require("./models/Author");
const { books,authors } = require("./data");
const connectToDB = require('./config/db');
require('dotenv').config();

// Connect To DB
connectToDB();

// Import Books
const importBooks = async () => {
    try {
        await Book.insertMany(books);
        console.log('Books Imported');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Remove Books
const removeBooks = async () => {
    try {
        await Book.deletetMany();
        console.log('Books Removed!');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Import Authors (seeding database)
const importAuthors = async () => {
    try {
        await Author.insertMany(authors);
        console.log("Authors Imported");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === '-import') {
    importBooks();
} else if (process.argv[2] === '-remove') {
    removeBooks();
} else if (process.argv[2] === "-import-authors") {
    importAuthors();
}

// Run _zsh: node seeder -import (for import data to database)
// Run _zsh: node seeder -remove (for remove data to database)