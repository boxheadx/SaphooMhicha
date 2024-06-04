const pool = require('../database/db');
const queries = require('../queries/userQueries');
const HttpError = require('../error/httpError');

const getUsers = (req, res) => {
    pool.query(queries.getUsers, (err, results)=>{
        if(err) throw err;
        res.status(200).json(results.rows);
    });
}

const getUser = async (req, res)=>{
    
    try{
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getUser, [id]); 
        if(!result.rows.length){
            throw new HttpError("User not found!", 200);
        }
        res.status(200).send(result.rows);
    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }

}


module.exports = {
    getUsers,
    getUser
}