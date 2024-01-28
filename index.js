const express = require('express'); // En node, el import express from 'express' no se puede hacer!
require('dotenv').config(); // npm i dotenv, para leer las variables de entorno
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Crear servidor de express
const app = express();

// Base de datos
dbConnection();

//CORS
app.use(cors());

// Directorio publico:
// el use es un middleware
app.use(express.static('public'));

// Lectura y parseo del bady
// Con esto puedo capturar el request que me envien en formato json del body
app.use(express.json());

// Rutas:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Escuchar peticiones:
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${process.env.PORT}`);
})