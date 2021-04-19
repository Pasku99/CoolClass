/*
Ruta base: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { loginCentroEducativo } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post('/logincentroeducativo', [
    check('password', 'El argumento pasword es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], loginCentroEducativo);

module.exports = router;