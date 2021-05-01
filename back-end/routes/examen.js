/*
Ruta base: /api/examenes
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearExamen } = require('../controllers/examen');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.post('/', [
    validarJWT,
    check('uidProfesor', 'El argumento uidProfesor es obligatorio').not().isEmpty().trim(),
    check('uidClase', 'El argumento uidClase es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura es obligatorio').not().isEmpty(),
    check('nombreExamen', 'El argumento nombreExamen es obligatorio').not().isEmpty(),
    check('preguntas', 'El argumento preguntas es obligatorio').not().isEmpty(),
    validarCampos,
], crearExamen);

module.exports = router;