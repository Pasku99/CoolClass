/*
Ruta base: /api/centroeducativo
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearCentro, obtenerCentros, obtenerClases, crearClase } = require('../controllers/centroeducativo');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    validarCampos,
], obtenerCentros);

router.post('/', [
    check('nombre', 'El argumento username es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('rol', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
], crearCentro);


router.get('/:id/clases', [
    validarJWT,
    // check('nombre', 'El argumento username es obligatorio').not().isEmpty().trim(),
    // check('uidCentro', 'El argumento debe ser válido').not().isEmpty().trim(),
    // validarCampos,
], obtenerClases);

router.post('/clases', [
    validarJWT,
    check('nombre', 'El argumento username es obligatorio').not().isEmpty().trim(),
    check('uidCentro', 'El argumento email debe ser un email').not().isEmpty().trim(),
    validarCampos,
], crearClase);

module.exports = router;