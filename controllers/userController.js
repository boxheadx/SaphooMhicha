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
        const id = req.user.user;
        const result = await pool.query(queries.getUser, [id]); 
        if(!result.rows.length){
            throw new HttpError("User not found!", 200);
        }
        res.status(200).send(result.rows);
    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }

}

const editUser = async(req, res)=>{
    try{
        const userid = req.user.user;
        const {username, profile_pic_url, email, current_password, new_password} = req.body;
        
        if(username){
            try{
                await pool.query(queries.updateUsername, [username, userid]);
            } catch(err){
                res.send(err).status(500);
            }
        }
        if(email){
            try{
                await pool.query(queries.updateEmail, [email, userid]);
            } catch(err){
                res.send(err).status(500);
            }
        }

        res.status(201).send('Info edited successfully');

    } catch(httpError){
        res.status(httpError.status).send(httpError.msg);
    }
}


module.exports = {
    getUsers,
    getUser,
    editUser
}