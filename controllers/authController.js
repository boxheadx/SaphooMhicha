const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const queries = require('../queries/authQueries');
const userQeries = require('../queries/userQueries');
const HttpError = require('../error/httpError');

const register = async (req, res)=>{
    try{
        const {firstname, lastname, email, password} = req.body;

        if(!firstname || !lastname || !email || !password){
            throw new HttpError("Please provide all the details!", 400);
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const check = await pool.query(userQeries.checkEmailExists, [email]);
        if(check.rows.length){
            throw new HttpError("Email already exists!", 400);
        } 

        const result = await pool.query(queries.addUser, [firstname, lastname, email, hashedPassword]);
        res.status(200).send('Registration Successful!');
       

    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }

}

module.exports = {
    register
}