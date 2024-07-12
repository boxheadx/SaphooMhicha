const sendError = (res, table, messages) => {
    if(messages[table]) {
        res.status(400).send(messages[table]);
    }
    else 
    {
        res.status(400).send(messages['default']);
    }
}

const handle = (res, err)=>{
    console.log(err)

    // HttpError
    if(err.status && err.msg) res.status(err.status).send(err.msg);

    // PSQL Error
    else if(err.severity=='ERROR' && err.code){
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

            case "22P02":
                sendError(res, err.table, {
                    "default" : "Invalid input!"
                });
                break;
            
            case "23514":
                sendError(res, err.table, {
                    "reviews" : "Rating must be between in range (1,5)",
                    "default" : "Invalid input!"
                });
                break;

            default:
                sendError(res, err.table, {
                    "default" : "Database error!"
                });
                break;

        }
    }
    else res.status(500).send('server error');
}

module.exports = { handle }