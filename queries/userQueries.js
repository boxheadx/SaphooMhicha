const getUsers = 'SELECT user_id, username FROM Users';
const getUser = 'SELECT username, email, profile_picture_url FROM Users where user_id=$1';
const checkEmailExists = 'SELECT * FROM Users where email=$1';
const getUserFromEmail = 'SELECT user_id FROM Users where email=$1';
const updateUsername = 'UPDATE Users SET username=$1 WHERE user_id=$2';
const updatePassword = 'UPDATE Users SET password_hash=$1 WHERE user_id=$2';
const updateEmail = 'UPDATE Users SET email=$1 WHERE user_id=$2';
const updateProfilePic = 'UPDATE Users SET profile_picture_url=$1 WHERE user_id=$2';

module.exports = {
    getUsers,
    getUser,
    checkEmailExists,
    getUserFromEmail,
    updateUsername,
    updateEmail,
    updatePassword,
    updateProfilePic
}