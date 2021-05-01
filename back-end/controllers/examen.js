const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Centroeducativo = require('../models/centroeducativo');
const Profesor = require('../models/profesor');
const Examen = require('../models/examen');
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

const crearExamen = async(req, res = response) => {
    const { uidProfesor, uidClase, asignatura, nombreExamen, preguntas, respuestas } = req.body;
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

module.exports = { crearExamen }