const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const queries = require('../queries/authQueries');
const userQeries = require('../queries/userQueries');
const HttpError = require('../error/httpError');
const {attachCookieToResponse} = require('../utils/jwt');

const register = async (req, res)=>{
    try{
        const {username, email, password, role} = req.body;

        if(!username || !email || !password || !role){
            throw new HttpError("Please provide all the details!", 400);
        }

        if(parseInt(role) < 0 || parseInt(role) > 1) throw new HttpError("Invalid role", 400);

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const check = await pool.query(userQeries.checkEmailExists, [email]);
        if(check.rows.length){
            throw new HttpError("Email already exists!", 400);
        } 

        await pool.query(queries.addUser, [username, email, hashedPassword, parseInt(role)]);
        if(parseInt(role) == 1){
            const getuid = await pool.query(userQeries.getUserFromEmail, [email]);
            await pool.query(queries.addAuthor, [getuid.rows[0].user_id]);
        }
        res.status(200).send('Registration Successful!');
       

    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }

}

const login = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password) throw new HttpError("Please provide email & password!", 400);
        if(!(await pool.query(userQeries.checkEmailExists, [email])).rows.length) throw new HttpError("Email doesn't exist!", 400);
        
        const results = await pool.query(queries.checkPassword, [email]);
        const password_hash  = results.rows[0].password_hash;
        const passwordMatched = await bcrypt.compare(password, password_hash);
        if(!passwordMatched) throw new HttpError("Invalid credentials!", 400);
        
        const getuser = await pool.query(userQeries.getUserFromEmail, [email]);
        const user = getuser.rows[0].user_id;
        attachCookieToResponse({res, user});

        res.status(200).send('Logged in successfully!');

    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }
}

module.exports = {
    register,
    login
}