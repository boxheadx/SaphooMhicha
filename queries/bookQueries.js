const getLatestBooks = 'SELECT Books.book_id, Books.title, username, cover_image_url, COALESCE(AVG(rating), 0) as avg_rating FROM Books JOIN Book_Authors ON Book_Authors.book_id=Books.book_id JOIN Authors ON Authors.author_id=Book_Authors.author_id JOIN Users ON Users.user_id = Authors.user_id LEFT JOIN Reviews on Reviews.book_id = Books.book_id GROUP BY Books.book_id, Users.username ORDER BY Books.publication_date ASC;';
const checkGenre = 'SELECT name FROM Genres WHERE name=$1';
const getBookDetails = 'SELECT Books.title, Books.description, Books.language, username, cover_image_url, publication_date, COALESCE(AVG(rating), 0) as avg_rating FROM Books JOIN Book_Authors ON Book_Authors.book_id=Books.book_id JOIN Authors ON Authors.author_id=Book_Authors.author_id JOIN Users ON Users.user_id = Authors.user_id LEFT JOIN Reviews ON Reviews.book_id = Books.book_id WHERE Books.book_id=$1 GROUP BY Books.book_id, Users.username';
const getBookGenres = 'SELECT Genres.name FROM Genres JOIN Book_Genres ON Book_Genres.genre_id = Genres.genre_id WHERE book_id=$1';
const addGenre = 'INSERT INTO Genres(name) VALUES($1)';
const getGenreIds = 'SELECT genre_id FROM Genres WHERE name=ANY($1)';
const linkBookGenre = 'INSERT INTO Book_Genres(book_id, genre_id) VALUES($1, $2)';
const getReviews = 'SELECT Users.username, Users.profile_picture_url, title, body, rating FROM Reviews JOIN Users ON Users.user_id = Reviews.user_id WHERE book_id=$1';
const addReview = 'INSERT INTO Reviews(user_id, book_id, title, body, rating) VALUES($1, $2, $3, $4, $5)';
const checkReviewExists = 'SELECT * FROM Reviews WHERE user_id=$1 AND book_id=$2';
const searchBook = "SELECT Books.book_id, Books.title, Books.description, Books.language, username, cover_image_url FROM Books JOIN Book_Authors ON Book_Authors.book_id=Books.book_id JOIN Authors ON Authors.author_id=Book_Authors.author_id JOIN Users ON Users.user_id = Authors.user_id WHERE Books.title ILIKE '%' || $1 || '%' GROUP BY Books.book_id, Users.username";
const getTopBooks = "SELECT b.book_id, b.title, b.isbn, b.publication_date, b.publisher, b.language, b.cover_image_url, b.description, AVG(r.rating) AS average_rating FROM Books b JOIN Reviews r ON b.book_id = r.book_id GROUP BY b.book_id ORDER BY average_rating DESC";

module.exports = {
    getLatestBooks,
    checkGenre,
    getBookDetails,
    addGenre,
    getGenreIds,
    linkBookGenre,
    getReviews,
    addReview,
    checkReviewExists,
    searchBook,
    getBookGenres,
    getTopBooks
}
