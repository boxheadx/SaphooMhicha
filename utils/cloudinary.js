const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const HttpError = require('../error/httpError');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async(image, folder)=>{
    var uploadedImg;
    if (!image.mimetype.startsWith('image')) {
        throw new HttpError('invalid file type', 400);
    }
    if (image.size > 10000000) {
        throw new HttpError('file too big', 400);
    }

    try{
        uploadedImg = await cloudinary.uploader.upload(image.tempFilePath, {
            use_filename: true,
            filename_override: image.name,
            folder: folder
        });

    } catch(err){
        console.log(err);
        throw new HttpError('failed to upload', 500);
    }

    fs.unlink(image.tempFilePath, (error) => {
        if (error) throw new HttpError("internal server error", 500);
    });

    return uploadedImg;
}

module.exports = uploadImage;