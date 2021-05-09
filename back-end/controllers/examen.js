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
const { pasarFechaDDMMYYYY } = require('../helpers/pasarFechaDDMMYYYY');
const { arrayAleatorio } = require('../helpers/arrayAleatorio');

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
    const idProfesor = req.query.idProfesor || '';

    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id) || (infoToken(token).uid === idProfesor))) {
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

        if (preguntas.length < 2) {
            return res.status(400).json({
                ok: false,
                msg: 'El examen ha de tener mínimo 2 preguntas'
            });
        }

        let fechaActualC = new Date();
        let fechaIngresadaC = new Date(fechaComienzo);
        if (fechaIngresadaC < fechaActualC) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de comienzo no puede ser menor a la fecha actual'
            });
        }

        let fechaActualF = new Date();
        let fechaIngresadaF = new Date(fechaFinal);
        if (fechaIngresadaF < fechaActualF) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de final no puede ser menor a la fecha actual'
            });
        }

        if (nombreExamen == '') {
            return res.status(400).json({
                ok: false,
                msg: 'Ha de ponerle un título al examen'
            });
        }

        const examenescreados = await Examen.findOne({ uidClase: uidClase, nombreExamen: nombreExamen });
        if (examenescreados) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya has creado un examen con ese nombre en la clase. Por favor, revíselo.'
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
        examen.fechaComienzo.setHours(examen.fechaComienzo.getHours() + 2);
        examen.fechaFinal.setHours(examen.fechaFinal.getHours() + 2);

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
    const { uidAlumno, uidExamen, uidProfesor, uidClase, respuestasCorrectas } = req.body;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidAlumno))) {
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

        for (let i = 0; i < clase.arrayAsignaturasProfesores.length; i++) {
            if (clase.arrayAsignaturasProfesores[i][0] == examen.asignatura) {
                if (clase.arrayAsignaturasProfesores[i][1] != uidProfesor) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No puedes crear exámenes en dicha asignatura'
                    });
                }
            }
        }

        if (examen.nombreClase != alumno.nombreClase) {
            return res.status(400).json({
                ok: false,
                msg: 'No puedes hacer este examen. No perteneces a la clase.'
            });
        }

        if (respuestasCorrectas.length != examen.preguntas.length) {
            return res.status(400).json({
                ok: false,
                msg: 'Has de incluir respuestas para ' + examen.preguntas.length + ' preguntas. Ni más ni menos.'
            });
        }

        let nota = 0;
        for (let i = 0; i < examen.respuestas.length; i++) {
            if (respuestasCorrectas[i] == examen.respuestas[i][0]) {
                nota++;
            } else if (respuestasCorrectas[i] == 'No responder') {

            } else {
                nota -= 0.33;
            }
        }

        nota = (nota * 10) / examen.preguntas.length;

        const {...object } = req.body;
        const examenResuelto = new ExamenResuelto(object);
        examenResuelto.nombreClase = clase.nombre;
        examenResuelto.nota = nota;
        examenResuelto.asignatura = examen.asignatura;
        examenResuelto.nombreExamen = examen.nombreExamen;
        examenResuelto.nombreAlumno = alumno.nombre;
        examenResuelto.preguntas = examen.preguntas;
        examenResuelto.respuestas = examen.respuestas;

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

const obtenerExamenesClaseProfesor = async(req, res = response) => {
    const uidProfesor = req.params.idProfesor;
    const uidClase = req.params.idClase;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar los exámenes',
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

        const examenesProfesor = await Examen.find({ uidProfesor: uidProfesor, nombreClase: clase.nombre });
        if (!examenesProfesor) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar examenes del profesor'
            });
        }

        res.json({
            ok: true,
            msg: 'getExamenesProfesor',
            examenesProfesor,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo examenes resueltos del alumno'
        });
    }
}

const obtenerNotasExamen = async(req, res = response) => {
    const uidExamen = req.params.idExamen;
    const uidProfesor = req.query.idProfesor;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar los exámenes',
            });
        }

        const examen = await Examen.findById(uidExamen);
        if (!examen) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar examen correspondiente'
            });
        }

        const examenesResueltos = await ExamenResuelto.find({ uidExamen: uidExamen });
        if (!examenesResueltos) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar examenes resueltos correspondientes'
            });
        }

        res.json({
            ok: true,
            msg: 'getNotasExamen',
            examenesResueltos,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo notas del examen'
        });
    }
}

const obtenerProximosExamenesAlumno = async(req, res = response) => {
    const uidAlumno = req.params.idAlumno;
    const uidProfesor = req.params.idProfesor;
    const uidClase = req.params.idClase;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidAlumno))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar los exámenes próximos',
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

        const alumno = await Alumno.findById(uidAlumno);
        if (!alumno) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar clase correspondiente'
            });
        }

        let fechaInicio = new Date();
        fechaInicio.setHours(fechaInicio.getHours() + 2);
        const proximosexamenesAlumno = await Examen.find({ uidProfesor: uidProfesor, nombreClase: clase.nombre, fechaFinal: { $gte: fechaInicio } }).sort({ fecha: 'asc' });
        if (!proximosexamenesAlumno) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar proximos examenes del alumno'
            });
        }

        // for (let i = 0; i < proximosexamenesAlumno.length; i++) {
        //     let fecha = pasarFechaDDMMYYYY(proximosexamenesAlumno[i].fechaComienzo);
        //     proximosexamenesAlumno[i].fechaComienzo = { fechaComienzo: fecha, ...proximosexamenesAlumno };
        //     proximosexamenesAlumno[i].fechaComienzo.toISOString();
        //     console.log(proximosexamenesAlumno[i].fechaComienzo)
        // }

        res.json({
            ok: true,
            msg: 'getExamenesProfesor',
            proximosExamenes: proximosexamenesAlumno,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo proximos examenes del alumno'
        });
    }
}

const obtenerExamenesAsignaturaAlumno = async(req, res = response) => {
    const uidAlumno = req.params.idAlumno;
    const uidProfesor = req.params.idProfesor;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidAlumno))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar los examenes resueltos del alumno',
            });
        }

        const alumno = await Alumno.findById(uidAlumno);
        if (!alumno) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al encontrar alumno correspondiente'
            });
        }

        const examenesAlumno = await ExamenResuelto.find({ uidAlumno: uidAlumno, uidProfesor: uidProfesor });
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

const obtenerExamenAlumno = async(req, res) => {

    const uidExamen = req.params.idExamen;
    const uidAlumno = req.query.idAlumno || '';
    const uidCentro = req.query.idCentro || '';
    let respuestas = [];
    let respuestasAleatorias = [];
    let preguntas = [];

    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidCentro) || (infoToken(token).uid === uidAlumno))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar exámenes',
            });
        }

        const examen = await Examen.findById(uidExamen);
        if (!examen) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar examen',
            });
        }

        let nombreExamen = examen.nombreExamen;

        for (let i = 0; i < examen.preguntas.length; i++) {
            preguntas.push(examen.preguntas[i]);
        }

        for (let i = 0; i < examen.respuestas.length; i++) {
            for (let j = 0; j < examen.respuestas[i].length; j++) {
                respuestas.push(examen.respuestas[i][j]);
            }
            arrayAleatorio(respuestas);
            respuestasAleatorias.push(respuestas);
            respuestas = [];
        }

        res.json({
            ok: true,
            msg: 'getExamen',
            nombreExamen,
            preguntas,
            respuestasAleatorias,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo examen'
        });
    }
}

const obtenerExamenesResueltosAlumno = async(req, res) => {
    const uidProfesor = req.params.idProfesor;
    const uidAlumno = req.params.idAlumno;
    const uidExamen = req.query.idExamen;

    try {
        // Se comprueba que sea rol admin para poder listar
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar exámenes',
            });
        }

        let examenesResueltos, total;
        if (uidExamen) {
            [examenesResueltos] = await Promise.all([
                ExamenResuelto.findOne({ _id: uidExamen, uidAlumno: uidAlumno }),
            ]);
            total = 1;
        } else {
            [examenesResueltos, total] = await Promise.all([
                ExamenResuelto.find({ uidProfesor: uidProfesor, uidAlumno: uidAlumno }),
                ExamenResuelto.countDocuments({ uidProfesor: uidProfesor, uidAlumno: uidAlumno })
            ]);
        }

        res.json({
            ok: true,
            msg: 'getExamenesResueltosAlumno',
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

const obtenerUltimosExamenesProfesor = async(req, res = response) => {
    const uidProfesor = req.params.idProfesor;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener los últimos exámenes',
            });
        }

        // Buscar examenes cuya fecha final sea menor a la actual
        let fechaActual = new Date();
        const ultimosExamenes = await Examen.find({ uidProfesor: uidProfesor, fechaFinal: { $lt: fechaActual } }).sort({ fecha: 'asc' }).limit(6);
        if (!ultimosExamenes) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar últimos exámenes',
            });
        }

        res.json({
            ok: true,
            msg: 'getUltimosExamenes',
            ultimosExamenes,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo últimos exámenes del profesor'
        });
    }
}

const obtenerProximosExamenesProfesor = async(req, res = response) => {
    const uidProfesor = req.params.idProfesor;
    try {
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uidProfesor))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener los próximos exámenes',
            });
        }

        // Buscar examenes cuya fecha final sea menor a la actual
        let fechaActual = new Date();
        const proximosExamenes = await Examen.find({ uidProfesor: uidProfesor, fechaComienzo: { $gte: fechaActual } }).sort({ fecha: 'asc' }).limit(6);
        if (!proximosExamenes) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al buscar próximos exámenes',
            });
        }

        res.json({
            ok: true,
            msg: 'getProximosExamenes',
            proximosExamenes,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo próximos exámenes del profesor'
        });
    }
}

module.exports = { obtenerExamenes, crearExamen, obtenerExamenResueltos, crearExamenResuelto, obtenerExamenesAlumnosCentro, obtenerExamenesClaseProfesor, obtenerNotasExamen, obtenerProximosExamenesAlumno, obtenerExamenesAsignaturaAlumno, obtenerExamenAlumno, obtenerExamenesResueltosAlumno, obtenerUltimosExamenesProfesor, obtenerProximosExamenesProfesor }