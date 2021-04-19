/*
Ruta base: /api/centroeducativo
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearCentro, obtenerCentros } = require('../controllers/centroeducativo');
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

// router.put('/np/:id', [
//     validarJWT,
//     check('id', 'El identificador no es válido').isMongoId(),
//     check('password', 'El argumento password es obligatorio').not().isEmpty().trim(),
//     check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
//     check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
//     validarCampos,
// ], actualizarPassword);

// router.put('/:id', [
//     validarJWT,
//     check('username', 'El argumento username es obligatorio').not().isEmpty().trim(),
//     check('email', 'El argumento email es obligatorio').not().isEmpty(),
//     check('email', 'El argumento email debe ser un email').isEmail(),
//     check('id', 'El identificador no es válido').isMongoId(),
//     check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
//     validarCampos,
// ], actualizarUsuario);

// router.delete('/:id', [
//     validarJWT,
//     check('id', 'El identificador no es válido').isMongoId(),
//     validarCampos
// ], borrarUsuario);

// router.delete('/all/users', [
//     validarJWT,
// ], borrarUsuarios);

// router.get('/confirmation/:token', [

// ], tokenVerification);

// router.post('/resend', [

// ], sendTokenPost);

// router.post('/recovery', [

// ], sendRecoverPassword);

// router.post('/rp/:token', [

// ], cambiarRecoveryPassword);

// router.post('/lastWeek', [
//     validarJWT,
// ], usuariosUltimaSemana);

// router.post('/lastMonths', [
//     validarJWT,
// ], usuariosUltimosMeses);

module.exports = router;