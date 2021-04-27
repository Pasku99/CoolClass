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

const actualizarProfesor = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { nombre, email, nuevopassword, nuevopassword2, ...object } = req.body;
    const uid = req.params.id;

    try {
        // Para actualizar profesor o eres admin o eres usuario del token y el uid que nos llega es el mismo
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener clases',
            });
        }

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un centro en BD con el email que nos llega en post
        const existeEmail = await Profesor.findOne({ email: email });

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

        // Comprueba si el nombre de centro ya existe

        const existeEmailCentro = await Centroeducativo.findOne({ email: email });

        if (existeEmailCentro) {
            if (existeEmailCentro._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // Comprobar si existe el centro que queremos actualizar
        const existeProfesor = await Profesor.findById(uid);

        if (!existeProfesor) {
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
        await existeProfesor.save();
        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        // al haber extraido password del req.body nunca se va a enviar en este put
        const profesor = await Profesor.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Profesor actualizado',
            profesor: profesor
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando profesor'
        });
    }

}

const obtenerClasesCentro = async(req, res = response) => {
    const uidProfesor = req.params.idprofesor;
    const uidCentro = req.params.idcentro;
    let arrayNombres = [];

    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener clases',
            });
        }
        const centro = await Centroeducativo.findById(uidCentro);
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar el centro correspondiente',
            });
        }
        const clases = await Clase.find({ uidCentro: uidCentro });
        if (!clases) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar clases del centro',
            });
        }
        for (let i = 0; i < clases.length; i++) {
            arrayNombres.push(clases[i].nombre);
        }
        res.json({
            ok: true,
            msg: 'getClasesCentro',
            clases,
            nombresCentro: arrayNombres,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Clases del profesor obtenidas con éxito'
        });
    }
}

const obtenerClasesProfesor = async(req, res = response) => {
    const uidProfesor = req.params.idprofesor;
    const uidCentro = req.params.idcentro;
    let arrayNombresNoProfesor = [];
    let asignaturasProfesor = [];
    const filtro = req.query.nombre || '';
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor) || (infoToken(token).uid === uidCentro))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener clases',
            });
        }
        const centro = await Centroeducativo.findById(uidCentro);
        if (!centro) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar el centro correspondiente',
            });
        }
        const clases = await Clase.find({ uidCentro: uidCentro });
        if (!clases) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar clases del centro',
            });
        }
        let noc = false;
        for (let i = 0; i < clases.length; i++) {
            noc = false;
            for (let j = 0; j < clases[i].arrayAsignaturasProfesores.length; j++) {
                if (noc == true) {
                    break;
                }
                for (let z = 0; z < clases[i].arrayAsignaturasProfesores[j].length; z++) {
                    if (clases[i].arrayAsignaturasProfesores[j][z + 1] == uidProfesor) {
                        noc = true;
                        asignaturasProfesor.push(clases[i].nombre);
                        asignaturasProfesor.push(clases[i].arrayAsignaturasProfesores[j][z]);
                        break;
                    } else {
                        noc = false;
                    }
                }
            }
            if (noc == false) {
                asignaturasProfesor.push(clases[i].nombre);
                asignaturasProfesor.push('');
            }
        }

        let esta = false;
        for (let i = 0; i < asignaturasProfesor.length; i++) {
            if (asignaturasProfesor[i + 1] == asignaturasProfesor.length) {
                break;
            }
            if (asignaturasProfesor[i + 1] == '') {
                for (let x = 0; x < clases.length; x++) {
                    esta = false;
                    if (clases[x].nombre == asignaturasProfesor[i]) {
                        if (clases[x].arrayProfesores != undefined || clases[x].arrayProfesores != null) {
                            if (clases[x].arrayProfesores == '') {

                            } else {
                                for (let j = 0; j < clases[x].arrayProfesores.length; j++) {
                                    if (clases[x].arrayProfesores[j] == uidProfesor) {
                                        esta = true;
                                        break;
                                    } else {

                                    }
                                }
                            }
                            if (!esta) {
                                arrayNombresNoProfesor.push(asignaturasProfesor[i]);
                                arrayNombresNoProfesor.push(asignaturasProfesor[i + 1]);
                                asignaturasProfesor.splice(i, 2);
                            }
                        }
                    }
                }
            }
        }
        if (filtro != '') {
            for (let i = 0; i < asignaturasProfesor.length; i = i + 2) {
                if (filtro == asignaturasProfesor[i]) {
                    asignaturasProfesor.push(asignaturasProfesor[i]);
                    asignaturasProfesor.push(asignaturasProfesor[i + 1]);
                    asignaturasProfesor.splice(0, asignaturasProfesor.length - 2);
                }
            }
        }
        res.json({
            ok: true,
            msg: 'getClasesCentro',
            clases,
            asignaturas: asignaturasProfesor,
            clasesNoProfesor: arrayNombresNoProfesor
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo clases del profesor'
        });
    }
}

const escogerAsignaturasProfesor = async(req, res = response) => {
    const { nombreClase, uidCentro, uidProfesor, asignatura } = req.body;
    let claseGuardada;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para agregar clases',
            });
        }
        const clase = await Clase.findOne({ uidCentro: uidCentro, nombre: nombreClase });
        if (!clase) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar la clase',
            });
        }
        let ocupado = false;
        for (let i = 0; i < clase.arrayAsignaturasProfesores.length; i++) {
            for (let j = 0; j < clase.arrayAsignaturasProfesores[i].length; j++) {
                if (clase.arrayAsignaturasProfesores[i][j] == asignatura) {
                    if (clase.arrayAsignaturasProfesores[i][j + 1] != '') {
                        return res.status(400).json({
                            ok: false,
                            msg: 'En la clase ya hay un profesor en dicha asignatura. Por favor, comuníquese con su centro.',
                        });
                    }
                }
            }
        }

        for (let i = 0; i < clase.arrayAsignaturasProfesores.length; i++) {
            for (let j = 0; j < clase.arrayAsignaturasProfesores[i].length; j++) {
                if (clase.arrayAsignaturasProfesores[i][j + 1] == uidProfesor) {
                    clase.arrayAsignaturasProfesores[i][j + 1] = '';
                }
            }
        }
        clase.markModified('arrayAsignaturasProfesores');
        claseGuardada = await clase.save();
        for (let i = 0; i < clase.arrayAsignaturasProfesores.length; i++) {
            for (let j = 0; j < clase.arrayAsignaturasProfesores[i].length; j++) {
                if (clase.arrayAsignaturasProfesores[i][j] == asignatura) {
                    if (clase.arrayAsignaturasProfesores[i][j + 1] != '') {
                        return res.status(400).json({
                            ok: false,
                            msg: 'En la clase ya hay un profesor en dicha asignatura. Por favor, comuníquese con su centro.',
                        });
                    } else {
                        clase.arrayAsignaturasProfesores[i][j + 1] = uidProfesor;
                    }
                }
            }
        }
        clase.markModified('arrayAsignaturasProfesores');
        claseGuardada = await clase.save();
        if (!claseGuardada) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar los cambios',
            });
        }
        res.json({
            ok: true,
            msg: 'anyadirAsignatura',
            clase: claseGuardada,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error agregando asignaturas'
        });
    }
}

const obtenerAsignaturas = async(req, res = response) => {
    try {
        let arrayAsignaturas = ['Matemáticas', 'Castellano', 'Inglés', 'Francés', 'Valenciano', 'FyQ', 'Biología', 'Tecnología', 'Informática', 'C.Sociales', 'E.Física', 'Latín'];
        res.json({
            ok: true,
            msg: 'getAsignaturas',
            asignaturas: arrayAsignaturas,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo asignaturas'
        });
    }
}

const escogerClasesProfesor = async(req, res = response) => {
    const { nombreClase, uidCentro, uidProfesor } = req.body;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para agregar clases',
            });
        }
        const clase = await Clase.findOne({ uidCentro: uidCentro, nombre: nombreClase });
        if (!clase) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar la clase',
            });
        }
        clase.arrayProfesores.push(uidProfesor);
        const claseGuardada = await clase.save();
        if (!claseGuardada) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar los cambios',
            });
        }
        res.json({
            ok: true,
            msg: 'anyadirClase',
            clase: claseGuardada,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error agregando clases'
        });
    }
}

const eliminarClaseAsignaturaProfesor = async(req, res = response) => {
    const { nombreClase, uidCentro, uidProfesor, asignatura } = req.body;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para eliminar las clases',
            });
        }
        const clase = await Clase.findOne({ uidCentro: uidCentro, nombre: nombreClase });
        if (!clase) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar la clase',
            });
        }
        if (asignatura == '') {
            for (let i = 0; i < clase.arrayProfesores.length; i++) {
                if (clase.arrayProfesores[i] == uidProfesor) {
                    clase.arrayProfesores.splice(i, 1);
                }
            }
        } else {
            for (let i = 0; i < clase.arrayAsignaturasProfesores.length; i++) {
                for (let j = 0; j < clase.arrayAsignaturasProfesores[i].length; j++) {
                    if (clase.arrayAsignaturasProfesores[i][j] == asignatura) {
                        if (clase.arrayAsignaturasProfesores[i][j] != '') {
                            clase.arrayAsignaturasProfesores[i][j + 1] = '';
                        } else {
                            return res.status(400).json({
                                ok: false,
                                msg: 'Esa clase no tiene ningún profesor asociado. No es posible borrarla.',
                            });
                        }
                    }
                }
            }
            for (let i = 0; i < clase.arrayProfesores.length; i++) {
                if (clase.arrayProfesores[i] == uidProfesor) {
                    clase.arrayProfesores.splice(i, 1);
                }
            }
        }
        clase.markModified('arrayAsignaturasProfesores');
        const claseGuardada = await clase.save();
        if (!claseGuardada) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al eliminar los cambios',
            });
        }
        res.json({
            ok: true,
            msg: 'eliminarClaseAsignaturaProfesor',
            clase: claseGuardada,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error eliminando clase del profesor'
        });
    }
}

module.exports = { crearProfesor, obtenerProfesores, obtenerClasesCentro, escogerAsignaturasProfesor, obtenerAsignaturas, escogerClasesProfesor, eliminarClaseAsignaturaProfesor, obtenerClasesProfesor, actualizarProfesor }