const bcrypt = require('bcrypt');
const pool = require('../database/db');
const queries = require('../queries/authQueries');
const userQeries = require('../queries/userQueries');
const HttpError = require('../error/httpError');
const { handle } = require('../error/errorHandler');
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

        await pool.query(queries.addUser, [username, email, hashedPassword, parseInt(role)]);
        if(parseInt(role) == 1){
            const getuid = await pool.query(userQeries.getUserFromEmail, [email]);
            await pool.query(queries.addAuthor, [getuid.rows[0].user_id]);
        }
        res.status(200).send('Registration Successful!');
       

    } catch(err){
        handle(res, err);
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

    } catch(err){
        handle(res, err);
    }
}

const logout = async(req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logged out!');
}

module.exports = {
    register,
    login,
    logout
}
