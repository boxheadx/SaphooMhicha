const pool = require('../database/db');
const HttpError = require('../error/httpError');
const { handle } = require('../error/errorHandler');
const queries = require('../queries/bookQueries');

const latestBooks = async(req, res) =>{
    try{
        const latest = await pool.query(queries.getLatestBooks);
        res.status(200).send(latest.rows);
    } catch(err) {
        handle(res, err);
    }
}
const latestBooksGenre = async(req, res) =>{
    
}
const getTopBooks = async(req, res) =>{
    try{
        const top = await pool.query(queries.getTopBooks);
        res.status(200).send(top.rows);
    } catch(err){
        handle(res, err);
    }
}
const getBook = async(req, res) =>{
    try{
        const { id } = req.params;
        const bookDetails = await pool.query(queries.getBookDetails, [id]);
        res.status(200).send(bookDetails.rows);
    } catch(err){
        handle(res, err);
    }
}
const postReview = async(req, res) =>{
    try{
        const user_id = req.user.user;
        const book_id = req.params.id;
        const { title, body, rating } = req.body;

        const bookDetails = await pool.query(queries.getBookDetails, [book_id]);
        if(!bookDetails.rows.length) throw new HttpError('Book doesn\'nt exist!', 400);
        
        const checkReviewExists = await pool.query(queries.checkReviewExists, [user_id, book_id]);
        if(checkReviewExists.rows.length) throw new HttpError('You have already reviewed this book!', 400);
        
        await pool.query(queries.addReview, [user_id, book_id, title, body, rating]);
        res.status(200).send('Succesfully posted review');
    } catch(err){
        handle(res, err);
    }
}

const bookSearch = async(req, res)=>{
    try{
        const { search } = req.body;
        const results = await pool.query(queries.searchBook, [search]);
        res.status(200).send(results.rows);
    } catch(err){
        handle(res, err);
    }
}

const getAllReviews = async(req, res) => {
    try{
        const book_id = req.params.id;
        const reviews = await pool.query(queries.getReviews, [book_id]);
        res.status(200).send(reviews.rows);
    } catch(err){
        handle(res, err);
    }
}

const getBookGenres = async(req, res)=>{
  try{
    const book_id = req.params.id;
    const genres = await pool.query(queries.getBookGenres, [book_id]);
    res.status(200).send(genres.rows);
  } catch(err){
    handle(res, err);
  }
}

module.exports = {
    latestBooks, 
    latestBooksGenre, 
    getTopBooks, 
    getBook, 
    postReview,
    bookSearch,
    getAllReviews,
    getBookGenres
}
