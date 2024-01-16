const jwt = require('jsonwebtoken');

const generarJWT = (uui, name) => {

    return new Promise((resolve, reject) => {
        const payload = { uui, name };
        jwt.sign(payload, process.env.SECRET_JKT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve(token);
        })
    })
};

module.exports = {
    generarJWT
}