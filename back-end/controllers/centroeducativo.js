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
const Clase = require('../models/clase');
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumno');
var ObjectId = require('mongodb').ObjectID;

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
        // Se comprueba que dicho email no exista ya en ningún tipo de usuario
        const existeEmail = await Centroeducativo.findOne({ email: email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        const existeEmailProfesor = await Profesor.findOne({ email: email });
        if (existeEmailProfesor) {
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

        // Se crean los codigos con caracteres aleatorios
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
            centroGuardado,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando centro educativo'
        });
    }
}

const actualizarCentro = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { nombre, email, nuevopassword, nuevopassword2, ...object } = req.body;
    const uid = req.params.id;

    try {
        // Para actualizar usuario o eres admin o eres usuario del token y el uid que nos llega es el mismo
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_CENTRO') || (infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar',
            });
        }

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un centro en BD con el email que nos llega en post
        const existeEmail = await Centroeducativo.findOne({ email: email });

        if (existeEmail) {
            // Si existe un centro con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        const existeEmailProfesor = await Profesor.findOne({ email: email });

        if (existeEmailProfesor) {
            // Si existe un centro con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmailProfesor._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // Comprueba si el nombre de centro ya existe

        const existeNombre = await Centroeducativo.findOne({ nombre: nombre });

        if (existeNombre) {
            if (existeNombre._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Nombre de centro ya existe'
                });
            }
        }

        // Comprobar si existe el centro que queremos actualizar
        const existeCentro = await Centroeducativo.findById(uid);

        if (!existeCentro) {
            return res.status(400).json({
                ok: false,
                msg: 'El centro no existe'
            });
        }
        // llegado aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;
        // igual con el username
        object.nombre = nombre;

        // Se actualiza la contraseña si llegan los campos
        if (nuevopassword != '' && nuevopassword2 != '') {
            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            const salt = bcrypt.genSaltSync();
            const cpassword = bcrypt.hashSync(nuevopassword, salt);
            object.password = cpassword;
        }

        // Almacenar en BD
        await existeCentro.save();
        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        // al haber extraido password del req.body nunca se va a enviar en este put
        const centro = await Centroeducativo.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            centro: centro
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const generarCodigoProfesor = async(req, res) => {
    const { uid, ...object } = req.body;
    try {
        const existeCentro = await Centroeducativo.findById(uid);

        if (!existeCentro) {
            return res.status(400).json({
                ok: false,
                msg: 'El centro no existe'
            });
        }

        const codigoProfesor = generator.generate({
            length: 8,
            numbers: true
        });

        const existeCodigo = await Centroeducativo.findOne({ codigoProfesor: codigoProfesor });

        if (existeCodigo) {
            if (existeCodigo._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El código de profesor ya existe para otro centro. Por favor, vuelva a generarlo.'
                });
            }
        }

        object.codigoProfesor = codigoProfesor;
        await existeCentro.save();

        const codigoProfesorActualizado = await Centroeducativo.findByIdAndUpdate(uid, object, { new: true });
        if (!codigoProfesorActualizado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar código de profesor'
            });
        }

        res.json({
            ok: true,
            msg: 'Código de profesor actualizado',
            centro: codigoProfesorActualizado.codigoProfesor
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error generando código profesor'
        });
    }
}

const generarCodigoAlumno = async(req, res) => {
    const { uid, ...object } = req.body;
    try {
        const existeCentro = await Centroeducativo.findById(uid);

        if (!existeCentro) {
            return res.status(400).json({
                ok: false,
                msg: 'El centro no existe'
            });
        }

        const codigoAlumno = generator.generate({
            length: 8,
            numbers: true
        });

        const existeCodigo = await Centroeducativo.findOne({ codigoAlumno: codigoAlumno });

        if (existeCodigo) {
            if (existeCodigo._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El código de alumno ya existe para otro centro. Por favor, vuelva a generarlo.'
                });
            }
        }

        object.codigoAlumno = codigoAlumno;
        await existeCentro.save();

        const codigoAlumnoActualizado = await Centroeducativo.findByIdAndUpdate(uid, object, { new: true });
        if (!codigoAlumnoActualizado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar código de alumno'
            });
        }

        res.json({
            ok: true,
            msg: 'Código de alumno actualizado',
            centro: codigoAlumnoActualizado.codigoAlumno
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error generando código profesor'
        });
    }
}

const obtenerClases = async(req, res) => {
    const id = req.params.id;
    const filtro = req.query.nombre || '';
    let arrayClases = [];
    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_CENTRO') || (infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar clases',
            });
        }

        const centro = await Centroeducativo.findById(id);
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar centro',
            });
        }

        const clases = await Clase.find({ uidCentro: id });
        if (!clases) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar clases',
            });
        }
        let total;
        if (filtro != '') {
            for (let i = 0; i < clases.length; i++) {
                if (clases[i].nombre == filtro) {
                    arrayClases.push(clases[i]);
                }
            }
            total = 1;
        } else {
            arrayClases = [...clases];
            total = arrayClases.length;
        }

        arrayClases = arrayClases.sort(function(a, b) {
            if (a.nombre < b.nombre) { return -1; }
            if (a.nombre > b.nombre) { return 1; }
            return 0;
        })

        res.json({
            ok: true,
            msg: 'getClases',
            arrayClases,
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

const crearClase = async(req, res = response) => {

    const { nombre, uidCentro } = req.body;

    try {
        const centro = await Centroeducativo.findById(uidCentro);
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar centro',
            });
        }

        const clases = await Clase.find({ uidCentro: uidCentro });
        if (!clases) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar clases',
            });
        }

        for (let i = 0; i < clases.length; i++) {
            if (clases[i].nombre == nombre) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El nombre de la clase ya está registrado en este centro. Por favor, pruebe con otro.',
                });
            }
        }

        // Vamos a tomar todo lo que nos llega por el req.body y crear el centro
        const {...object } = req.body;
        const clase = new Clase(object);
        // Lo guardamos en base de datos
        const claseGuardada = await clase.save();
        if (!claseGuardada) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al almacenar la clase',
            });
        }

        res.json({
            ok: true,
            msg: 'Clase registrada con éxito',
            claseGuardada,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando centro educativo'
        });
    }
}

const obtenerProfesores = async(req, res) => {
    // Para búsqueda por texto
    // Obtenemos el ID del centro
    const id = req.params.id;
    // El filtro por nombre del profesor si se da el caso
    const filtro = req.query.nombre || '';
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
        if (filtro == '') {
            [profesores, total] = await Promise.all([
                Profesor.find({ uidCentro: id }),
                Profesor.countDocuments({ uidCentro: id })
            ]);
        } else {
            [profesores, total] = await Promise.all([
                Profesor.find({ uidCentro: id, nombre: filtro }),
                Profesor.countDocuments({ uidCentro: id, nombre: filtro })
            ]);
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

module.exports = { crearCentro, obtenerCentros, obtenerClases, crearClase, actualizarCentro, generarCodigoProfesor, generarCodigoAlumno, obtenerProfesores }