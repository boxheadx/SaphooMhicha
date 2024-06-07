const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const queries = require('../queries/authQueries');
const userQeries = require('../queries/userQueries');
const HttpError = require('../error/httpError');

const register = async (req, res)=>{
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            throw new HttpError("Please provide all the details!", 400);
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const check = await pool.query(userQeries.checkEmailExists, [email]);
        if(check.rows.length){
            throw new HttpError("Email already exists!", 400);
        } 

        const result = await pool.query(queries.addUser, [username, email, hashedPassword]);
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
        
        const results = await pool.query(userQeries.checkEmailExists, [email]);
        const user = results.rows[0];
        const passwordMatched = await bcrypt.compare(password, user.password_hash);
        if(!passwordMatched){
            throw new HttpError("Invalid credentials!", 400);
        }

        res.status(200).send('Logged in successfully!');

    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }
}

module.exports = {
    register,
    login
}