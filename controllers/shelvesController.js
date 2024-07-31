const queries = require('../queries/shelvesQueries');
const bookQueries = require('../queries/bookQueries');
const HttpError = require('../error/httpError');
const { handle } = require('../error/errorHandler');
const pool = require('../database/db');

const getShelves = async(req, res)=>{
    try{
        const user_id = req.user.user;
        const shelves = await pool.query(queries.getAllShelves, [user_id]);
        if(!shelves.rows.length){
            throw new HttpError('No shelves!', 404);
        }
        res.status(200).send(shelves.rows);
    } catch(err){
        handle(res, err);
    }
}

const getShelfBooks = async(req, res)=>{
    try{
        const user_id = req.user.user;
        const {shelf_id} = req.params;
        const check = await pool.query(queries.checkShelfBelongs, [shelf_id, user_id]);

        if(!check.rows.length){
            throw new HttpError('This shelf does not exist!', 400);
        }
        const books = await pool.query(queries.getBooksFromShelf, [shelf_id]);
        if(!books.rows.length) throw new HttpError('The shelf is empty!', 200);

        const book_ids = books.rows.map((book)=>{return book.book_id});
    
        const book_details = book_ids.map(async (book_id)=>{
            const details = await pool.query(bookQueries.getBookDetails, [book_id]);
            return ({
                book_id: book_id,
                title: details.rows[0].title,
                author: details.rows[0].username,
                cover_image_url: details.rows[0].cover_image_url
            });
        })
        const shelf_books = await Promise.all(book_details);
        res.status(200).send(shelf_books);
        
    } catch(err){
        handle(res, err);
    }
}

const createShelf = async(req, res)=>{
    try{
        const user_id = req.user.user;
        const { name } = req.body;
        if(!name) throw new HttpError('Provide a shelf name!', 400);

        const check = await pool.query(queries.checkShelfExists, [name]);
        if(check.rows.length) throw new HttpError('Shelf already exists!', 400);

        await pool.query(queries.createShelf, [user_id, name]);

        res.status(201).send('Shelf created!');

    } catch(err){
        handle(res, err);
    }
}

const addABookToShelf = async(req, res)=>{
    try{
        const user_id = req.user.user;
        const { shelf_id } = req.params;
        const { book_id } = req.body;
        const check = await pool.query(queries.checkShelfBelongs, [shelf_id, user_id]);
        if(!check.rows.length){
            throw new HttpError('This shelf does not exist!', 400);
        }
        const checkBookExists = await pool.query(queries.checkBookInShelf, [book_id, shelf_id]);
        if(checkBookExists.rows.length) throw new HttpError('Book already in shelf!', 400);

        await pool.query(queries.addBookToShelf, [book_id, shelf_id]);
        res.status(200).send('Book added!');
    } catch(err){
        handle(res, err);
    }
}

const removeBook = async(req, res)=>{
    try{
        const user_id = req.user.user;
        const {shelf_id} = req.params;
        const {book_id} = req.body;
        const check = await pool.query(queries.checkShelfBelongs, [shelf_id, user_id]);

        if(!check.rows.length){
            throw new HttpError('This shelf does not exist!', 400);
        }
        const checkBookExists = await pool.query(queries.checkBookInShelf, [book_id, shelf_id]);
        if(!checkBookExists.rows.length) throw new HttpError('Book is not in shelf!', 400);

        await pool.query(queries.removeBookFromShelf, [shelf_id, book_id]);
        res.status(200).send('Book removed!');

    } catch(err){
        handle(res, err);
    }
}

module.exports = {
    getShelves,
    getShelfBooks,
    createShelf,
    addABookToShelf,
    removeBook
}