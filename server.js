require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const continentRoutes = require('./routes/continentRoutes');
const wonderRoutes = require('./routes/wonderRoutes');
const {connectDB, closeDB} = require('./config/db');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());

connectDB();

app.get('/', function(req, res) {
    res.send("Welcome to Earth!!");
});

app.use('/continent', continentRoutes);
app.use('/wonder', wonderRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received: closing HTTP Server`);
    server.close(async () => {
        console.log("Http server closed");
        await closeDB();
        process.exit(0);
    })
}
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));