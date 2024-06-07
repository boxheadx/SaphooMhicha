const addUser = 'INSERT INTO users(username, email, password_hash) VALUES ($1, $2, $3)';

module.exports = {
    addUser
}
