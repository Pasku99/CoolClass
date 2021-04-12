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
    AjustesCentroEducativoPage
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
    AjustesCentroEducativoPage
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
