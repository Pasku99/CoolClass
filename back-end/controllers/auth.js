const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const Centroeducativo = require('../models/centroeducativo');
var ObjectId = require('mongodb').ObjectID;

const loginCentroEducativo = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const centro = await Centroeducativo.findOne({ email });
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, centro.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const { _id, rol } = centro;
        const token = await generarJWT(centro._id, centro.rol);

        res.json({
            ok: true,
            msg: 'login',
            uid: _id,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}

module.exports = { loginCentroEducativo }