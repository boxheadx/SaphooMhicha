const getUsers = 'SELECT * FROM users';
const getUser = 'SELECT * FROM users where user_id=$1';
const checkEmailExists = 'SELECT * FROM users where email=$1';
const addUser = 'INSERT INTO users(first_name, last_name, email) VALUES ($1, $2, $3)';

module.exports = {
    getUsers,
    getUser,
    checkEmailExists,
    addUser
}