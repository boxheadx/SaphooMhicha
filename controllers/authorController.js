const HttpError = require('../error/httpError');
const pool = require('../database/db');
const queries = require('../queries/authorQueries');
const bookQueries = require('../queries/bookQueries');
const uploadImage = require('../utils/cloudinary');
const { handle } = require('../error/errorHandler');

const isAuthor = async (user_id)=>{
    const result = await pool.query(queries.getRole, [user_id]);
    const role = result.rows[0].user_role;
    return role == 1;
}

const postBook = async(req, res) =>{
    try{

        const user_id = req.user.user;
        const isUserAuthor = await isAuthor(user_id);

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
  
        if(!Array.isArray(genres)) throw new HttpError('Select atleast 3 genres', 400);
        if(genres.length > 5) throw new HttpError('Too many genres', 400);

        genres.forEach(async (genre)=>{
            console.log(genre)
            const check = await pool.query(bookQueries.checkGenre, [genre]);
            if(!check.rows.length) await pool.query(bookQueries.addGenre, [genre]);
        })

        const cover_img = await uploadImage(book_cover, 'saphoomhicha/book_covers');
        if(!cover_img || !cover_img.secure_url) throw new HttpError('Failed to upload cover image', 500);
        await pool.query(queries.addBook, [title, isbn, publication_date, publisher, language, description, cover_img.secure_url]);
        const book = await pool.query(queries.getBookId, [isbn]);
        if(!book.rows.length) throw new HttpError('Failed to add the book', 500);
        const author = await pool.query(queries.getAuthor, [user_id]);
        const author_id = author.rows[0].author_id;
        const book_id = book.rows[0].book_id;
            
        await pool.query(queries.linkBook, [book_id, author_id]);

        const genre_ids = await pool.query(bookQueries.getGenreIds, [genres]);

        genre_ids.rows.forEach(async(genre) =>{
            await pool.query(bookQueries.linkBookGenre, [book_id, genre.genre_id]);
        })

        res.status(200).send('Book posted mr author!');


    } catch(err){
        console.log(`error caught: ${err}`)
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
        res.status(200).send(books.rows);


    } catch(err){
        handle(res, err);
    }
}

const editBook = async(req, res)=>{
    try{
        const user_id = req.user.user;
        const bookId = req.params.id;
        const isUserAuthor = await isAuthor(user_id);

        if(!isUserAuthor){
           throw new HttpError('Sorry, you are not an author!', 400);
        }

        const author_user = await pool.query(queries.checkBookAuthor, [bookId]);
        if(author_user.rows[0].user_id != user_id) throw new HttpError('Unauthorized!', 401);

        const { title, publisher, isbn, publication_date, language, description, genres } = req.body;

        var book_cover;

        if(req.files && req.files.book_cover) book_cover = req.files.book_cover;

        if(genres){
            if(!Array.isArray(genres) || genres.length < 3) throw new HttpError('Select atleast 3 genres', 400);
            if(genres.length > 5) throw new HttpError('Too many genres', 400);
    
            genres.forEach(async (genre)=>{
                console.log(genre)
                const check = await pool.query(bookQueries.checkGenre, [genre]);
                if(!check.rows.length) await pool.query(bookQueries.addGenre, [genre]);
            })
            await pool.query(queries.unlinkGenres, [bookId]);
            const genre_ids = await pool.query(bookQueries.getGenreIds, [genres]);

            genre_ids.rows.forEach(async(genre) =>{
                await pool.query(bookQueries.linkBookGenre, [bookId, genre.genre_id]);
            })
        }
        
        if(book_cover){
            const cover_img = await uploadImage(book_cover, 'saphoomhicha/book_covers');
            if(!cover_img || !cover_img.secure_url) throw new HttpError('Failed to upload cover image', 500);
            await pool.query(queries.editBookCoverImageUrl, [cover_img.secure_url, bookId]);
            
        }
        if (title) await pool.query(queries.editBookTitle, [title, bookId]);
        if (description) await pool.query(queries.editBookDescription, [description, bookId]);
        if (language) await pool.query(queries.editBookLanguage, [language, bookId]);
        if (publication_date) await pool.query(queries.editBookPublicationDate, [publication_date, bookId]);
        if (publisher) await pool.query(queries.editBookPublisher, [publisher, bookId]);
        if (isbn) await pool.query(queries.editBookISBN, [isbn, bookId]);
    
       
        res.status(200).send('Book edited!');

    } catch(err){
        handle(res, err);
    }
}

module.exports = {
    postBook,
    getBooks,
    editBook
}