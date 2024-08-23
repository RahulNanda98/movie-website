const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes')
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use('/user', userRoutes);

mongoose.connect(process.env.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log(`server started on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error('Database connection error', err);
    process.exit(1);
});

