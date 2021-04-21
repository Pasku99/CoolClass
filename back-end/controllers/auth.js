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
            token,
            rol
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

const tokenCentro = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const centro = await Centroeducativo.findById(uid);
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = centro.rol;

        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombre: centro.nombre,
            email: centro.email,
            rol: rolBD,
            imagen: centro.imagen,
            codigoProfesor: centro.codigoProfesor,
            codigoAlumno: centro.codigoAlumno,
            token: nuevoToken
        });

    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',
            token: ''
        });
    }
}

const buscarTipoUsuario = async(req, res = response) => {
    const { email } = req.body;
    let resultado;
    try {
        const centro = await Centroeducativo.find({ email: email });
        if (centro.length == 0) {

        }
        resultado = centro;
        res.json({
            ok: true,
            msg: 'buscarTipoUsuario',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar el tipo de usuario',
            token: ''
        });
    }
}

module.exports = { loginCentroEducativo, tokenCentro, buscarTipoUsuario }