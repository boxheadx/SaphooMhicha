const pool = require('../database/db');
const queries = require('../queries/userQueries');
const HttpError = require('../error/httpError');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');


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

        console.log(req.files);
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
            if (!profile_pic.mimetype.startsWith('image')) {
                throw new HttpError('invalid file type', 400);
            }
            if (profile_pic.size > 10000000) {
                throw new HttpError('file too big', 400);
            }

            try{

                uploadedImg = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    use_filename: true,
                    filename_override: req.files.image.name,
                    folder: 'saphoomhicha/profile_pics'
                });

            } catch(err){
                console.log(err);
                throw new HttpError('failed to upload', 500);
            }

            fs.unlink(req.files.image.tempFilePath, (error) => {
                if (error) throw new HttpError("internal server error", 500);
            });

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