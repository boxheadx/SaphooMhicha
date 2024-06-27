const getRole = 'SELECT user_role FROM Users WHERE user_id=$1';
const addBook = 'INSERT INTO Books(title, isbn, publication_date, publisher, language, description) VALUES($1, $2, $3, $4, $5, $6)';
const getAuthor = 'SELECT author_id FROM Authors WHERE user_id=$1';
const getBookId = 'SELECT book_id FROM Books WHERE isbn=$1';
const linkBook = 'INSERT INTO Book_Authors(book_id, author_id) VALUES($1, $2)';
const getAuthorFromUsername = 'SELECT author_id FROM Authors JOIN Users ON Users.user_id = Authors.user_id WHERE Users.username=$1';
const getBooks = 'SELECT * FROM Books JOIN Book_Authors ON Book_Authors.book_id = Books.book_id WHERE Book_Authors.author_id = $1';

module.exports = {
    getRole,
    addBook,
    getAuthor,
    getBookId,
    linkBook,
    getAuthorFromUsername,
    getBooks
}