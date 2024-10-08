const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const shelvesRoutes = require('./routes/shelvesRoutes');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }))
app.use(cors({
    origin : ["http://localhost:3000", "https://saphoomhicha.netlify.app"],
    credentials: true
  })
)

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/author', authorRoutes);
app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/shelves', shelvesRoutes);

app.get('/', (req, res)=>{
  res.send('SaphooMhicha API');
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})