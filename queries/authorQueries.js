const getRole = 'SELECT user_role FROM Users WHERE user_id=$1';
const addBook = 'INSERT INTO Books(title, isbn, publication_date, publisher, language, description, cover_image_url) VALUES($1, $2, $3, $4, $5, $6, $7)';
const getAuthor = 'SELECT author_id FROM Authors WHERE user_id=$1';
const getBookId = 'SELECT book_id FROM Books WHERE isbn=$1';
const linkBook = 'INSERT INTO Book_Authors(book_id, author_id) VALUES($1, $2)';
const getAuthorFromUsername = 'SELECT author_id FROM Authors JOIN Users ON Users.user_id = Authors.user_id WHERE Users.username=$1';
const getBooks = 'SELECT * FROM Books JOIN Book_Authors ON Book_Authors.book_id = Books.book_id WHERE Book_Authors.author_id = $1';
const editBookTitle = 'UPDATE Books SET title=$1 WHERE book_id=$2';
const editBookDescription = 'UPDATE Books SET description=$1 WHERE book_id=$2';
const editBookLanguage = 'UPDATE Books SET language=$1 WHERE book_id=$2';
const editBookPublicationDate = 'UPDATE Books SET publication_date=$1 WHERE book_id=$2';
const editBookPublisher = 'UPDATE Books SET publisher=$1 WHERE book_id=$2';
const editBookISBN = 'UPDATE Books SET isbn=$1 WHERE book_id=$2';
const editBookCoverImageUrl = 'UPDATE Books SET cover_image_url=$1 WHERE book_id=$2';
const checkBookAuthor = 'SELECT Authors.user_id FROM Authors JOIN Book_Authors ON Book_Authors.author_id=Authors.author_id WHERE Book_Authors.book_id=$1';
const unlinkGenres = 'DELETE FROM Book_Genres WHERE book_id=$1';
const getAuthorFromId = 'SELECT * FROM Authors WHERE author_id=$1';

module.exports = {
    getRole,
    addBook,
    getAuthor,
    getBookId,
    linkBook,
    getAuthorFromUsername,
    getBooks, 
    editBookTitle,
    editBookDescription,
    editBookLanguage,
    editBookPublicationDate,
    editBookPublisher,
    editBookISBN,
    editBookCoverImageUrl,
    checkBookAuthor,
    unlinkGenres,
    getAuthorFromId
}