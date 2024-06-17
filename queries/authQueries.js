const addUser = 'INSERT INTO Users(username, email, password_hash, user_role) VALUES ($1, $2, $3, $4)';
const checkPassword = 'SELECT password_hash FROM Users where email=$1';
const addAuthor = 'INSERT INTO Authors(user_id) VALUES ($1)';

module.exports = {
    addUser, checkPassword,
    addAuthor
}
