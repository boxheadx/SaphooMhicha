const HttpError = require('../error/httpError');
const pool = require('../database/db');
const queries = require('../queries/authorQueries');
const uploadImage = require('../utils/cloudinary');
const { handle } = require('../error/errorHandler');

const isAuthor = async (user_id)=>{
    try{
        const result = await pool.query(queries.getRole, [user_id]);
        const role = result.rows[0].user_role;
        return role == 1;
    } catch(err){
        console.log(err);
        return -1;
    }
}

const postBook = async(req, res) =>{
    try{

        const user_id = req.user.user;
        const isUserAuthor = await isAuthor(user_id);

        if(isUserAuthor == -1) throw new HttpError('Failed to verify user role', 500);

        if(!isUserAuthor){
           throw new HttpError('Sorry, you are not an author!', 400);
        }

        const { title, publisher, isbn, publication_date, language, description, genres } = req.body;

        var book_cover;

        if(!req.files || !req.files.book_cover){
            throw new HttpError('Please provide a book cover!', 400);
        }
        book_cover = req.files.book_cover;

        if(!title || !publisher || !isbn || !publication_date || !language || !description || !genres) throw new HttpError('Please provide all the details!', 400);
  
        const cover_img = await uploadImage(book_cover, 'saphoomhicha/book_covers');
        if(!cover_img || !cover_img.secure_url) throw new HttpError('Failed to upload cover image', 500);
        await pool.query(queries.addBook, [title, isbn, publication_date, publisher, language, description, cover_img.secure_url]);
        const book = await pool.query(queries.getBookId, [isbn]);
        if(!book.rows.length) throw new HttpError('Failed to add the book', 500);
        const author = await pool.query(queries.getAuthor, [user_id]);
        const author_id = author.rows[0].author_id;
        const book_id = book.rows[0].book_id;

        console.log(genres);
            
        await pool.query(queries.linkBook, [book_id, author_id]);

        res.send('Book posted mr author!').status(200);


    } catch(err){
        handle(res, err);
    }
}

const getBooks = async(req, res)=>{
    try{
        const { author } = req.params;
        var author_id = null;
      
        const authorIdQuery = await pool.query(queries.getAuthorFromUsername, [author]);
        if(!authorIdQuery.rows.length) throw new HttpError('Author not found!', 404);
        author_id = authorIdQuery.rows[0].author_id;
        
        const books = await pool.query(queries.getBooks, [author_id]);
        if(!books.rows.length) throw new HttpError('No books found!', 404); 
        res.send(books.rows).status(200);


    } catch(err){
        handle(res, err);
    }
}

module.exports = {
    postBook,
    getBooks
}