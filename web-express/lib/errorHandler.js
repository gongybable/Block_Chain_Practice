module.exports = function errorHandler() {
    return function errorHandler(err, req, res, next) {
        var key, error;
    
        if (err.validation) {
            return res.status(400).json(err.validation);
        }
    
        error = { code: 'INTERNAL_ERROR'};
        error.name = err.name;
        error.message = err.message;
        error.stack = err.stack;
    
        for (key in err) {
            if (err.hasOwnProperty(key)) { error[key] = err[key]; }
        }
    
        // Only send error message if a response was not yet sent.
        if (!res.headersSent) { res.status(500).json({ error: [ error ] }); }
    };
};