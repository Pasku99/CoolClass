const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Centroeducativo = require('../models/centroeducativo');
const Profesor = require('../models/profesor');
const Examen = require('../models/examen');
const ExamenResuelto = require('../models/examen-resuelto');
const { validarPassword } = require('../helpers/validarPassword');
const { infoToken } = require('../helpers/infoToken');
const generator = require('generate-password');
const Clase = require('../models/clase');
var ObjectId = require('mongodb').ObjectID;
const Alumno = require('../models/alumno');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const obtenerExamenes = async(req, res) => {
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
                msg: 'No tiene permisos para listar exámenes',
            });
        }

        let examenes, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [examenes] = await Promise.all([
                Examen.findById(id),
            ]);
            total = 1;
        }
        // Si no ha llegado ID, hacemos el get /
        else {
            if (texto) {
                [examenes, total] = await Promise.all([
                    Examen.find({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] }),
                    Examen.countDocuments({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] })
                ]);
            } else {
                [examenes, total] = await Promise.all([
                    Examen.find({}),
                    Examen.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'getExamenes',
            examenes,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo examenes'
        });
    }
}

const crearExamen = async(req, res = response) => {
    const { uidProfesor, uidClase, asignatura, nombreExamen, preguntas, respuestas, fechaComienzo, fechaFinal } = req.body;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar profesores',
            });
        }

        const profesor = await Profesor.findById(uidProfesor);
        if (!profesor) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar profesor correspondiente'
            });
        }

        const clase = await Clase.findById(uidClase);
        if (!clase) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar clase correspondiente'
            });
        }

        for (let i = 0; i < clase.arrayAsignaturasProfesores.length; i++) {
            if (clase.arrayAsignaturasProfesores[i][0] == asignatura) {
                if (clase.arrayAsignaturasProfesores[i][1] != uidProfesor) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No puedes crear exámenes en dicha asignatura'
                    });
                }
            }
        }

        if (preguntas.length != respuestas.length) {
            return res.status(400).json({
                ok: false,
                msg: 'Has de incluir respuestas para ' + preguntas.length + ' preguntas. Ni más ni menos.'
            });
        }

        const {...object } = req.body;
        const examen = new Examen(object);
        examen.nombreClase = clase.nombre;

        const examenGuardado = await examen.save();
        if (!examenGuardado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al almacenar el examen',
            });
        }

        res.json({
            ok: true,
            msg: 'crearExamen',
            examen,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando examen'
        });
    }
}

const obtenerExamenResueltos = async(req, res) => {
    // Para búsqueda por texto
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }
    const id = req.query.id || '';

    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar exámenes',
            });
        }

        let examenesResueltos, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [examenesResueltos] = await Promise.all([
                ExamenResuelto.findById(id),
            ]);
            total = 1;
        }
        // Si no ha llegado ID, hacemos el get /
        else {
            if (texto) {
                [examenesResueltos, total] = await Promise.all([
                    ExamenResuelto.find({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] }),
                    ExamenResuelto.countDocuments({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] })
                ]);
            } else {
                [examenesResueltos, total] = await Promise.all([
                    ExamenResuelto.find({}),
                    ExamenResuelto.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'getExamenesResueltos',
            examenesResueltos,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo examenes resueltos'
        });
    }
}

const crearExamenResuelto = async(req, res = response) => {
    const { uidAlumno, uidExamen, uidProfesor, uidClase, respuestas } = req.body;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear examen resuelto',
            });
        }

        const alumno = await Alumno.findById(uidAlumno);
        if (!alumno) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar alumno correspondiente'
            });
        }

        const examen = await Examen.findById(uidExamen);
        if (!examen) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar examen correspondiente'
            });
        }

        const examenRealizado = await ExamenResuelto.findOne({ uidAlumno: uidAlumno, uidExamen: uidExamen });
        if (examenRealizado) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya has realizado el examen. ¡No seas tramposo!',
            });
        }

        const profesor = await Profesor.findById(uidProfesor);
        if (!profesor) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar profesor correspondiente'
            });
        }

        const clase = await Clase.findById(uidClase);
        if (!clase) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar clase correspondiente'
            });
        }

        if (respuestas.length != examen.preguntas.length) {
            return res.status(400).json({
                ok: false,
                msg: 'Has de incluir respuestas para ' + examen.preguntas.length + ' preguntas. Ni más ni menos.'
            });
        }

        let nota = 0;
        for (let i = 0; i < examen.respuestas.length; i++) {
            if (respuestas[i] == examen.respuestas[i][0]) {
                nota++;
            } else if (respuestas[i] == 'No responder') {

            } else {
                nota -= 0.33;
            }
        }

        const {...object } = req.body;
        const examenResuelto = new ExamenResuelto(object);
        examenResuelto.nombreClase = clase.nombre;
        examenResuelto.nota = nota;
        examenResuelto.asignatura = examen.asignatura;
        examenResuelto.nombreExamen = examen.nombreExamen;
        examenResuelto.nombreAlumno = alumno.nombre;

        const examenResueltoGuardado = await examenResuelto.save();
        if (!examenResueltoGuardado) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al almacenar el examen resuelto',
            });
        }

        res.json({
            ok: true,
            msg: 'crearExamen',
            examenResuelto,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando examen resuelto'
        });
    }
}

const obtenerExamenesAlumnosCentro = async(req, res = response) => {
    const uidAlumno = req.params.idAlumno;
    const uidCentro = req.query.idCentro || '';
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidCentro))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar alumnos del centro',
            });
        }

        const alumno = await Alumno.findById(uidAlumno);
        if (!alumno) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar alumno correspondiente'
            });
        }

        const examenesAlumno = await ExamenResuelto.find({ uidAlumno: uidAlumno });
        if (!examenesAlumno) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar examenes del alumno'
            });
        }

        res.json({
            ok: true,
            msg: 'getExamenesAlumno',
            examenesAlumno,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo examenes resueltos del alumno'
        });
    }
}

module.exports = { obtenerExamenes, crearExamen, obtenerExamenResueltos, crearExamenResuelto, obtenerExamenesAlumnosCentro }