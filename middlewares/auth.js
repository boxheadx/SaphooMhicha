const jwt = require('jsonwebtoken');
const HttpError = require('../error/httpError');
const pool = require('../database/db');
const queries = require('../queries/userQueries');

const authenticateUser = async (req, res, next) => {
    try{
        const token = req.signedCookies.token;
        if (!token) {
            throw new HttpError("Authentication Invalid", 401);
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        const checkUser = await pool.query(queries.getUser, [req.user.user]);
        if(!checkUser.rows.length) throw new HttpError("Unauthorized", 401);

        next();
    } catch(httpError){
        res.send(httpError.msg).status(httpError.status);
    }

}

module.exports = {
    authenticateUser
}