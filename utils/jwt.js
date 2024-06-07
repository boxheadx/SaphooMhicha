const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    const token = jwt.sign({payload}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE
    });
    return token
}


const attachCookieToResponse = ({ res, user }) => {
    const token = createJWT(user);
    res.cookie('token', token);
}

module.exports = { attachCookieToResponse }