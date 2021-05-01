/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('./database/configdb');

// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json());

app.use('/api/centroeducativo', require('./routes/centroeducativo'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/profesores', require('./routes/profesor'));
app.use('/api/alumnos', require('./routes/alumno'));
app.use('/api/examenes', require('./routes/examen'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});