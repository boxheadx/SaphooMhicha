const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})