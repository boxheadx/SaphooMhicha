const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    const token = jwt.sign({user: payload}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE
    });
    return token
}


const attachCookieToResponse = ({ res, user }) => {
    console.log(`attaching ${user} into cookie`);
    const token = createJWT(user);
    try{
        res.cookie('token', token,  {
            httpOnly: true,
            maxAge: 24*60*60*1000,  
            secure: true,
            sameSite: "None",
            signed: true
        });
    } catch(err){console.log(err);}
}

module.exports = { attachCookieToResponse }