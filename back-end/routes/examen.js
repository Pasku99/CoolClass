/*
Ruta base: /api/examenes
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearExamen, obtenerExamenes, crearExamenResuelto, obtenerExamenResueltos, obtenerExamenesAlumnosCentro, obtenerExamenesClaseProfesor, obtenerNotasExamen } = require('../controllers/examen');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de profesor debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerExamenes);

router.post('/', [
    validarJWT,
    check('uidProfesor', 'El argumento uidProfesor es obligatorio').not().isEmpty().trim(),
    check('uidClase', 'El argumento uidClase es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura es obligatorio').not().isEmpty(),
    // check('nombreExamen', 'El argumento nombreExamen es obligatorio').not().isEmpty(),
    check('preguntas', 'El argumento preguntas es obligatorio').not().isEmpty(),
    check('fechaComienzo', 'El argumento fechaComienzo es obligatorio').not().isEmpty(),
    check('fechaFinal', 'El argumento fechaFinal es obligatorio').not().isEmpty(),
    validarCampos,
], crearExamen);

router.get('/examenesresueltos', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de profesor debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerExamenResueltos);

router.post('/examenresuelto', [
    validarJWT,
    check('uidAlumno', 'El argumento uidAlumno es obligatorio').not().isEmpty(),
    check('uidExamen', 'El argumento uidExamen es obligatorio').not().isEmpty(),
    check('uidProfesor', 'El argumento uidProfesor es obligatorio').not().isEmpty().trim(),
    check('uidClase', 'El argumento uidClase es obligatorio').not().isEmpty().trim(),
    check('respuestas', 'El argumento respuestas es obligatorio').not().isEmpty(),
    validarCampos,
], crearExamenResuelto);

router.get('/examenesresueltos/:idAlumno', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('idAlumno', 'El id de alumno debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerExamenesAlumnosCentro);

router.get('/examenesprofesor/:idProfesor/:idClase', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('idProfesor', 'El id de profesor debe ser válido').optional().isMongoId(),
    check('idClase', 'El id de clase debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerExamenesClaseProfesor);

router.get('/notas/:idExamen', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('idExamen', 'El id de examen debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerNotasExamen);


module.exports = router;