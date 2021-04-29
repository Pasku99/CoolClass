/*
Ruta base: /api/alumnos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerAlumnos, crearAlumno, escogerClase, obtenerAsignaturas, obtenerProfesor, actualizarAlumno } = require('../controllers/alumno');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de alumno debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerAlumnos);

router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('rol', 'El argumento rol es obligatorio').not().isEmpty(),
    check('codigoAlumno', 'El argumento codigoAlumno es obligatorio').not().isEmpty(),
    validarCampos,
], crearAlumno);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    validarCampos,
], actualizarAlumno);

router.post('/escogerclase', [
    check('uidAlumno', 'El argumento uidAlumno es obligatorio').not().isEmpty().trim(),
    check('uidCentro', 'El argumento uidCentro es obligatorio').not().isEmpty(),
    check('nombreClase', 'El argumento nombreClase es obligatorio').not().isEmpty(),
], escogerClase);

router.get('/obtenerclase', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de clase debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerAsignaturas);

router.get('/:id/profesor', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de clase debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerProfesor);

module.exports = router;