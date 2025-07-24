const express = require('express');
const dotenv = require('dotenv').config();
const dbConnections = require('./config/dbConnections');
const errorHandler = require('./middleware/errorHandler');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dbConnections();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use('/uploads', express.static('uploads'));

app.use(errorHandler)

app.use(cors({
    credentials: true
}));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});