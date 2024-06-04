const getUsers = 'SELECT * FROM users';
const getUser = 'SELECT user_id, first_name, last_name FROM users where user_id=$1';
const checkEmailExists = 'SELECT * FROM users where email=$1';

module.exports = {
    getUsers,
    getUser,
    checkEmailExists
}