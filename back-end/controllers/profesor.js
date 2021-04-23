const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Centroeducativo = require('../models/centroeducativo');
const Profesor = require('../models/profesor');
const { validarPassword } = require('../helpers/validarPassword');
const { infoToken } = require('../helpers/infoToken');
const generator = require('generate-password');
const Clase = require('../models/clase');
var ObjectId = require('mongodb').ObjectID;

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const obtenerProfesores = async(req, res) => {
    // Para búsqueda por texto
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }
    // Obtenemos el ID del profesor por si quiere buscar solo un profesor
    const id = req.query.id || '';

    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar profesores',
            });
        }

        let profesores, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [profesores] = await Promise.all([
                Profesor.findById(id),
            ]);
            total = 1;
        }
        // Si no ha llegado ID, hacemos el get /
        else {
            if (texto) {
                [profesores, total] = await Promise.all([
                    Profesor.find({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] }),
                    Profesor.countDocuments({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] })
                ]);
            } else {
                [profesores, total] = await Promise.all([
                    Profesor.find({}),
                    Profesor.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'getProfesores',
            profesores,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo profesores'
        });
    }
}

const crearProfesor = async(req, res = response) => {

    const { nombre, email, password, rol, codigoProfesor } = req.body;

    try {
        // Se comprueba que dicho codigo de profesor corresponda con algún centro
        const centro = await Centroeducativo.find({ codigoProfesor: codigoProfesor });
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar centro educativo correspondiente'
            });
        }
        if (centro.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningún centro con ese código de profesor. Por favor, póngase en contacto con su centro educativo.'
            });
        }
        const uidCentro = centro[0]._id;
        // Se comprueba que dicho email no exista ya en ningun tipo de usuario
        const existeEmailProfesor = await Profesor.findOne({ email: email });
        if (existeEmailProfesor) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        const existeEmailCentro = await Centroeducativo.findOne({ email: email });
        if (existeEmailCentro) {
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

        // Vamos a tomar todo lo que nos llega por el req.body y crear el profesor
        const {...object } = req.body;
        const profesor = new Profesor(object);
        profesor.password = cpassword;
        profesor.uidCentro = uidCentro;
        // Lo guardamos en base de datos
        const profesorGuardado = await profesor.save();
        if (!profesorGuardado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al almacenar el profesor',
            });
        }

        res.json({
            ok: true,
            msg: 'Profesor registrado con éxito',
            profesorGuardado,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando profesor'
        });
    }
}

// const escogerClases = async(req, res = response) => {
//     const uidCentro = req.params.id;
//     try {
//         const clases = await Clase.find({ uidCentro: uidCentro });
//         if (!clases) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Error al encontrar clases del centro'
//             });
//         }

//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             ok: false,
//             msg: 'Clase escogida con éxito'
//         });
//     }
// }

module.exports = { crearProfesor, obtenerProfesores }