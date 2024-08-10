# SaphooMhicha

This project is developed as a part of the Database Management System (DBMS) course by Matina Tuladhar (THA078BEI047) and Sajen Maharjan (THA078BEI048).

Backend for dbms project

A website to keep track of the books you're reading or want to read

# Setup

* Create a postgres database
* Create cloudinary account and get the api key, api secret, etc
* Clone this repo

```bash
git clone https://github.com/boxheadx/SaphooMhicha.git
```
* Go to SaphooMhicha directory and create a file named ".env"

```
PG_HOST="localhost"
PG_PORT=5432
PG_USER="postgres"
PG_PASSWORD="your database password"
PG_DB="database name"

JWT_SECRET="any random key here"
JWT_LIFE="1d"

CLOUDINARY_NAME="the one you got from cloudinary"
CLOUDINARY_API_KEY="the key you got from cloudinary"
CLOUDINARY_API_SECRET="the secret you got from cloudinary"
```

* Now run the server.js (runs on localhost:3000)

```bash
node server.js
```

* Now you can interact with the server using postman or a frontend.

For example, send a post request at http://localhost:3000/api/v1/auth/register with username, password, email and role parameters to create a user.

Check server.js and routes for api endpoints
