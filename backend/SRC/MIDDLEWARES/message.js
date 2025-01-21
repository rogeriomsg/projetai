
const ValidationErrorMessage = (err, req, res, next) => {
    
    if (err.joi) {
        const details = err.joi.details.map(detail => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return res.status(400).json({ errors: details });
    }
    return res.status(500).send('Erro interno do servidor.');
}

module.exports = { 
    ValidationErrorMessage,
};