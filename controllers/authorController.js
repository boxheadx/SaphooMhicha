const HttpError = require('../error/httpError');
const pool = require('../database/db');
const queries = require('../queries/authorQueries');
const uploadImage = require('../utils/cloudinary');

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
            res.status(400).send('Sorry, you are not an author!');
        }

        const { title, publisher, isbn, publication_date, language, description } = req.body;

        var book_cover;

        if(req.files){
            try{
                book_cover = req.files.book_cover;
            } catch(err){
                console.log(err);
                throw new HttpError('File error', 400);
            }
        }
        else{
            throw new HttpError('Please provide a book cover!', 400);
        }

        if(!title || !publisher || !isbn || !publication_date || !language || !description) throw new HttpError('Please provide all the details!', 400);

        try{
            const cover_img = await uploadImage(book_cover, 'saphoomhicha/book_covers');
            await pool.query(queries.addBook, [title, isbn, publication_date, publisher, language, description, cover_img.secure_url]);
            const author = await pool.query(queries.getAuthor, [user_id]);
            const book = await pool.query(queries.getBookId, [isbn]);
            const author_id = author.rows[0].author_id;
            const book_id = book.rows[0].book_id;
            
            await pool.query(queries.linkBook, [book_id, author_id]);

        } catch(err){
            console.log(err);
            res.send('Error adding book!').status(500);
        }

        res.send('Book posted mr author!').status(200);


    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }
}

const getBooks = async(req, res)=>{
    try{
        const { author } = req.params;
        var author_id = null;

        try{
            const authorIdQuery = await pool.query(queries.getAuthorFromUsername, [author]);
            author_id = authorIdQuery.rows[0].author_id;
        } catch(err){
            console.log(err);
            throw new HttpError("Author not found!", 400);
        }

        try{
            const books = await pool.query(queries.getBooks, [author_id]);
            res.send(books.rows).status(200);
        } catch(err){
            console.log(err);
            throw new HttpError("Failed to fetch books", 500);
        }

    } catch(httpError){
        res.send(httpError.msg).status(httpError.status);
    }
}

module.exports = {
    postBook,
    getBooks
}