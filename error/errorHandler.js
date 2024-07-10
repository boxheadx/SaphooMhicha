const sendError = (res, table, messages) => {
    if(messages[table]) res.send(messages[table]).status(400);
    else res.send(messages['default']).status(400);
}

const handle = (res, err)=>{
    console.log(err)

    // HttpError
    if(err.status && err.msg) res.send(err.msg).status(err.status);

    // PSQL Error
    else if(err.name == 'error' && err.severity=='ERROR' && err.code){
        switch(err.code){
            case '23505':   // UNIQUE
                sendError(res, err.table, {
                    "books" : "ISBN must be unique!",
                    "users" : "Username and email must be unique!"
                });
                break;
            case '23502':   // NOT NULL
                sendError(res, err.table, {
                    "default" : "Please provide all details!"
                });
                break;

            default:
                sendError(res, err.table, {
                    "default" : "Database error!"
                });

        }
    }
    else res.send('server error').status(500);
}

module.exports = { handle }