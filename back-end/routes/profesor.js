/*
Ruta base: /api/profesores
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProfesores, crearProfesor, escogerClases } = require('../controllers/profesor');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de centro debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerProfesores);

router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('rol', 'El argumento rol es obligatorio').not().isEmpty(),
    check('codigoProfesor', 'El argumento codigoProfesor es obligatorio').not().isEmpty(),
    validarCampos,
], crearProfesor);

// router.post('/escogerclase', [
//     validarCampos,
// ], escogerClases);

module.exports = router;