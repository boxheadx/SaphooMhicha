const getUsers = 'SELECT user_id, username FROM Users';
const getUser = 'SELECT user_id, username FROM Users where user_id=$1';
const checkEmailExists = 'SELECT * FROM Users where email=$1';

module.exports = {
    getUsers,
    getUser,
    checkEmailExists
}