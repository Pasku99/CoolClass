import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { RegistroCentroEducativoPage } from './centro-educativo/registro-centro-educativo/registro-centro-educativo.page';
import { RegistroProfesorPage } from './profesor/registro-profesor/registro-profesor.page';
import { RegistroAlumnoPage } from './alumno/registro-alumno/registro-alumno.page';
import { PantallaPrincipalCentroEducativoPage } from './centro-educativo/pantalla-principal-centro-educativo/pantalla-principal-centro-educativo.page';
import { ClasesCentroEducativoPage } from './centro-educativo/clases-centro-educativo/clases-centro-educativo.page';
import { AccordionListComponent } from '../components/accordion-list/accordion-list.component';
import { ProfesoresClaseCentroEducativoPage } from './centro-educativo/profesores-clase-centro-educativo/profesores-clase-centro-educativo.page';
import { ClaseAlumnosCentroEducativoPage } from './centro-educativo/clase-alumnos-centro-educativo/clase-alumnos-centro-educativo.page';
import { ClaseAlumnosNotasCentroEducativoPage } from './centro-educativo/clase-alumnos-notas-centro-educativo/clase-alumnos-notas-centro-educativo.page';
import { ProfesoresCentroEducativoPage } from './centro-educativo/profesores-centro-educativo/profesores-centro-educativo.page';
import { PerfilCentroEducativoPage } from './centro-educativo/perfil-centro-educativo/perfil-centro-educativo.page';
import { EditarPerfilCentroEducativoPage } from './centro-educativo/editar-perfil-centro-educativo/editar-perfil-centro-educativo.page';
import { CodigosCentroEducativoPage } from './centro-educativo/codigos-centro-educativo/codigos-centro-educativo.page';
import { AjustesCentroEducativoPage } from './centro-educativo/ajustes-centro-educativo/ajustes-centro-educativo.page';
import { EscogerClasesProfesorPage } from './profesor/escoger-clases-profesor/escoger-clases-profesor.page';
import { EscogerAsignaturasProfesorPage } from './profesor/escoger-asignaturas-profesor/escoger-asignaturas-profesor.page';
import { PantallaPrincipalProfesorPage } from './profesor/pantalla-principal-profesor/pantalla-principal-profesor.page';
import { MisClasesProfesorPage } from './profesor/mis-clases-profesor/mis-clases-profesor.page';
import { MisAlumnosProfesorPage } from './profesor/mis-alumnos-profesor/mis-alumnos-profesor.page';
import { NotasAlumnosProfesorPage } from './profesor/notas-alumnos-profesor/notas-alumnos-profesor.page';
import { ComprobarExamenProfesorPage } from './profesor/comprobar-examen-profesor/comprobar-examen-profesor.page';
import { MisExamenesProfesorPage } from './profesor/mis-examenes-profesor/mis-examenes-profesor.page';
import { CrearExamenProfesorPage } from './profesor/crear-examen-profesor/crear-examen-profesor.page';
import { PerfilProfesorPage } from './profesor/perfil-profesor/perfil-profesor.page';
import { EditarPerfilProfesorPage } from './profesor/editar-perfil-profesor/editar-perfil-profesor.page';
import { EscogerClasesConfigProfesorPage } from './profesor/escoger-clases-config-profesor/escoger-clases-config-profesor.page';
import { EscogerAsignaturasConfigProfesorPage } from './profesor/escoger-asignaturas-config-profesor/escoger-asignaturas-config-profesor.page';
import { AjustesProfesorPage } from './profesor/ajustes-profesor/ajustes-profesor.page';
import { EscogerClaseAlumnoPage } from './alumno/escoger-clase-alumno/escoger-clase-alumno.page';
import { PantallaPrincipalAlumnoPage } from './alumno/pantalla-principal-alumno/pantalla-principal-alumno.page';

@NgModule({
  declarations: [
    RegistroCentroEducativoPage,
    RegistroProfesorPage,
    RegistroAlumnoPage,
    PantallaPrincipalCentroEducativoPage,
    ClasesCentroEducativoPage,
    AccordionListComponent,
    ProfesoresClaseCentroEducativoPage,
    ClaseAlumnosCentroEducativoPage,
    ClaseAlumnosNotasCentroEducativoPage,
    ProfesoresCentroEducativoPage,
    PerfilCentroEducativoPage,
    EditarPerfilCentroEducativoPage,
    CodigosCentroEducativoPage,
    AjustesCentroEducativoPage,
    EscogerClasesProfesorPage,
    EscogerAsignaturasProfesorPage,
    PantallaPrincipalProfesorPage,
    MisClasesProfesorPage,
    MisAlumnosProfesorPage,
    NotasAlumnosProfesorPage,
    ComprobarExamenProfesorPage,
    MisExamenesProfesorPage,
    CrearExamenProfesorPage,
    PerfilProfesorPage,
    EditarPerfilProfesorPage,
    EscogerClasesConfigProfesorPage,
    EscogerAsignaturasConfigProfesorPage,
    AjustesProfesorPage,
    EscogerClaseAlumnoPage,
    PantallaPrincipalAlumnoPage
  ],
  exports: [
    RegistroCentroEducativoPage,
    RegistroProfesorPage,
    RegistroAlumnoPage,
    PantallaPrincipalCentroEducativoPage,
    ClasesCentroEducativoPage,
    AccordionListComponent,
    ProfesoresClaseCentroEducativoPage,
    ClaseAlumnosCentroEducativoPage,
    ClaseAlumnosNotasCentroEducativoPage,
    ProfesoresCentroEducativoPage,
    PerfilCentroEducativoPage,
    EditarPerfilCentroEducativoPage,
    CodigosCentroEducativoPage,
    AjustesCentroEducativoPage,
    EscogerClasesProfesorPage,
    EscogerAsignaturasProfesorPage,
    PantallaPrincipalProfesorPage,
    MisClasesProfesorPage,
    MisAlumnosProfesorPage,
    NotasAlumnosProfesorPage,
    ComprobarExamenProfesorPage,
    MisExamenesProfesorPage,
    CrearExamenProfesorPage,
    PerfilProfesorPage,
    EditarPerfilProfesorPage,
    EscogerClasesConfigProfesorPage,
    EscogerAsignaturasConfigProfesorPage,
    AjustesProfesorPage,
    EscogerClaseAlumnoPage,
    PantallaPrincipalAlumnoPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})

export class PagesModule { }
