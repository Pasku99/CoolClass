const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const { infoToken } = require('../helpers/infotoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Centroeducativo = require('../models/centroeducativo');
const { validarPassword } = require('../helpers/validarPassword');
const { infoToken } = require('../helpers/infoToken');
const generator = require('generate-password');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const obtenerCentros = async(req, res) => {
    // Para búsqueda por texto
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }
    // Obtenemos el ID del centro por si quiere buscar solo un centro
    const id = req.query.id || '';

    //await sleep(1000);
    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar usuarios',
            });
        }

        let centros, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [centros] = await Promise.all([
                Centroeducativo.findById(id),
            ]);
            total = 1;
        }
        // Si no ha llegado ID, hacemos el get /
        else {
            if (texto) {
                [centros, total] = await Promise.all([
                    Centroeducativo.find({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] }),
                    Centroeducativo.countDocuments({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] })
                ]);
            } else {
                [centros, total] = await Promise.all([
                    Centroeducativo.find({}),
                    Centroeducativo.countDocuments()
                ]);
            }

        }
        res.json({
            ok: true,
            msg: 'getCentros',
            centros,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo usuarios'
        });
    }
}

const crearCentro = async(req, res = response) => {

    const { nombre, email, password, rol } = req.body;

    try {
        // Se comprueba que dicho email no exista ya
        const existeEmail = await Centroeducativo.findOne({ email: email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // Se valida que la contraseña tenga minúsculas, mayúsculas, número y al menos 8 caracteres
        const passwordValidada = await validarPassword(password);

        if (!passwordValidada) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña ha de tener mínimo 8 caracteres y estar formada al menos por una mayúscula, minúscula y un número',
            });
        }
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const codigoProfesor = generator.generate({
            length: 8,
            numbers: true
        });

        const codigoAlumno = generator.generate({
            length: 8,
            numbers: true
        });


        // Vamos a tomar todo lo que nos llega por el req.body y crear el centro
        const {...object } = req.body;
        const centro = new Centroeducativo(object);
        centro.password = cpassword;
        centro.codigoProfesor = codigoProfesor;
        centro.codigoAlumno = codigoAlumno;
        // Lo guardamos en base de datos
        const centroGuardado = await centro.save();

        if (!centroGuardado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al almacenar el centro educativo',
            });
        }

        res.json({
            ok: true,
            msg: 'Centro educativo registrado con éxito',
            centro,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando centro educativo'
        });
    }
}

module.exports = { crearCentro, obtenerCentros }