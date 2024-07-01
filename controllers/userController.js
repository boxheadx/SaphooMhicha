const pool = require('../database/db');
const queries = require('../queries/userQueries');
const HttpError = require('../error/httpError');
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
        var profile_pic;

        if(req.files){
            profile_pic = req.files.image;
        }

        const {username, email, current_password, new_password} = req.body;
        
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

        var uploadedImg;

        if(profile_pic){
            uploadedImg = await uploadImage(profile_pic, 'saphoomhicha/profile_pics');
            try{

                await pool.query(queries.updateProfilePic, [uploadedImg.secure_url, userid]);

            } catch(err){
                console.log(err);
                throw new HttpError('failed to upload', 500);
            }
        }

        res.status(201).send('Info edited successfully');

    } catch(httpError){
        console.log(httpError);
        res.status(httpError.status).send(httpError.msg);
    }
}


module.exports = {
    getUsers,
    getUser,
    editUser
}