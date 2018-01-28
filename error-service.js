const handleError = (err) => {
    if (err) {
        // handle different types of errors in here
        console.log('handlerError',err);
        return err;
    }
}

module.exports = {
    handleError: handleError
}