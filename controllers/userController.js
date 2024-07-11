const pool = require('../database/db');
const queries = require('../queries/userQueries');
const HttpError = require('../error/httpError');
const { handle } = require('../error/errorHandler');
const uploadImage = require('../utils/cloudinary');


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
            throw new HttpError("User not found!", 404);
        }
        res.status(200).send(result.rows);
    } catch(err){
        handle(res, err);
    }

}

const editUser = async(req, res)=>{
    try{
        const userid = req.user.user;
        var profile_pic;

        if(req.files){
            profile_pic = req.files.image;
        }

        const {username, email, current_password, new_password} = req.body;
        
        if(username){
            await pool.query(queries.updateUsername, [username, userid]);
        }
        if(email){  
            await pool.query(queries.updateEmail, [email, userid]);
        }

        var uploadedImg;

        if(profile_pic){
            uploadedImg = await uploadImage(profile_pic, 'saphoomhicha/profile_pics');
            if(!uploadedImg || !uploadedImg.secure_url) throw new HttpError('Failed to upload image!', 500);
            await pool.query(queries.updateProfilePic, [uploadedImg.secure_url, userid]);
        }

        res.status(200).send('Info edited successfully');

    } catch(err){
        handle(res, err);
    }
}


module.exports = {
    getUsers,
    getUser,
    editUser
}