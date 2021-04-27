const { response } = require('express');
const bcrypt = require('bcryptjs');
const Clase = require('../models/clase');
const Centroeducativo = require('../models/centroeducativo');
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumno');
const { validarPassword } = require('../helpers/validarPassword');
const { infoToken } = require('../helpers/infoToken');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const obtenerAlumnos = async(req, res) => {
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

        let alumnos, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [alumnos] = await Promise.all([
                Alumno.findById(id),
            ]);
            total = 1;
        }
        // Si no ha llegado ID, hacemos el get /
        else {
            if (texto) {
                [alumnos, total] = await Promise.all([
                    Alumno.find({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] }),
                    Alumno.countDocuments({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] })
                ]);
            } else {
                [alumnos, total] = await Promise.all([
                    Alumno.find({}),
                    Alumno.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'getAlumnos',
            alumnos,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo alumnos'
        });
    }
}

const crearAlumno = async(req, res = response) => {

    const { nombre, email, password, rol, codigoAlumno } = req.body;

    try {
        // Se comprueba que dicho codigo de profesor corresponda con algún centro
        const centro = await Centroeducativo.find({ codigoAlumno: codigoAlumno });
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar centro educativo correspondiente'
            });
        }
        if (centro.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningún centro con ese código de alumno. Por favor, póngase en contacto con su centro educativo.'
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

        const existeEmailAlumno = await Alumno.findOne({ email: email });
        if (existeEmailAlumno) {
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
        const alumno = new Alumno(object);
        alumno.password = cpassword;
        alumno.uidCentro = uidCentro;
        // Lo guardamos en base de datos
        const alumnoGuardado = await alumno.save();
        if (!alumnoGuardado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al almacenar el alumno',
            });
        }

        res.json({
            ok: true,
            msg: 'Alumno registrado con éxito',
            alumnoGuardado,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando alumno'
        });
    }
}

module.exports = { obtenerAlumnos, crearAlumno }