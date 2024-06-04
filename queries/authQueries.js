const addUser = 'INSERT INTO users(first_name, last_name, email, user_password) VALUES ($1, $2, $3, $4)';

module.exports = {
    addUser
}
