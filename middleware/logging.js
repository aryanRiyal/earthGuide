function logRequest (req, res, next) {
    console.log(`[${new Date().toLocaleString()}] Request Made  to : ${req.originalUrl}`);
    return next();
};

module.exports = { logRequest };