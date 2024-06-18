const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})