//NOT FOUND ERROR HANDLER (POINTLESS ROUTE)
const notFound = (req, res, next) => {
    const error = new Error(`YES, hi, not found -> ${req.originalUrl}`);
    res.status(404)
    next(error)
}

//INTERNAL ERROR MIDDLEWARE (SOMETHING NOT FOUND)
//LA MIDDLEWARE SOTTOSTANTE SI INSERISCE NELLA CODA DI RISPOSTA OGNI VOLTA CHE UN ERRORE VIENE MANDATO
//SERVE A INVIARE UN SEMPLICE JSON AL POSTO DI CODICE HTML RAPPRESENTANTE L'ERRORE
const errorHandler = (err, req, res, next) => {
    //imposta lo status della richiesta da 'ok'(200) a 'internal error'(500)
    //puo capitare che nonostante scatti l'errore lo status non si cambi da solo, è una precauzione
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export default { notFound, errorHandler }
