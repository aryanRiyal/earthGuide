const express = require('express');
const bodyParser = require('body-parser');
const continentRoutes = require('./routes/continentRoutes');
const wonderRoutes = require('./routes/wonderRoutes');
const { connectDB, closeDB } = require('./database/db');
const { logRequest } = require('./middleware/logging');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

connectDB();

app.use(logRequest);

app.get('/', function (req, res) {
    res.send('Welcome to Earth!!');
});

app.use('/continents', continentRoutes);
app.use('/wonders', wonderRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received: closing HTTP Server`);
    server.close(async () => {
        console.log('Http server closed');
        await closeDB();
        process.exit(0);
    });
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
