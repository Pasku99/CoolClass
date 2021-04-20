/*
Ruta base: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { loginCentroEducativo, buscarTipoUsuario, tokenCentro } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/tokencentro', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], tokenCentro);

router.post('/centroeducativo', [
    check('password', 'El argumento pasword es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], loginCentroEducativo);

router.post('/buscartipo', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], buscarTipoUsuario);

module.exports = router;