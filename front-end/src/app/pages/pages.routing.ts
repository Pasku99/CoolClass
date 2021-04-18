import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { RegistroCentroEducativoPage } from './centro-educativo/registro-centro-educativo/registro-centro-educativo.page';
import { RegistroProfesorPage } from './profesor/registro-profesor/registro-profesor.page';
import { RegistroAlumnoPage } from './alumno/registro-alumno/registro-alumno.page';
import { TabsCentroEducativoComponent } from '../layouts/tabs-centro-educativo/tabs-centro-educativo.component';
import { PantallaPrincipalCentroEducativoPage } from './centro-educativo/pantalla-principal-centro-educativo/pantalla-principal-centro-educativo.page';
import { ClasesCentroEducativoPage } from './centro-educativo/clases-centro-educativo/clases-centro-educativo.page';
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
import { TabsProfesorComponent } from '../layouts/tabs-profesor/tabs-profesor.component';
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
import { TabsAlumnoComponent } from '../layouts/tabs-alumno/tabs-alumno.component';
import { MisAsignaturasAlumnoPage } from './alumno/mis-asignaturas-alumno/mis-asignaturas-alumno.page';
import { InfoAsignaturaAlumnoPage } from './alumno/info-asignatura-alumno/info-asignatura-alumno.page';
import { MisExamenesAlumnoPage } from './alumno/mis-examenes-alumno/mis-examenes-alumno.page';
import { HacerExamenAlumnoPage } from './alumno/hacer-examen-alumno/hacer-examen-alumno.page';

const routes: Routes = [
  { path: 'registro', component: BlankLayoutComponent,
    children: [
      { path: 'centro-educativo', component: RegistroCentroEducativoPage},
      { path: 'profesor', component: RegistroProfesorPage},
      { path: 'profesor/escoger-clases', component: EscogerClasesProfesorPage},
      { path: 'profesor/escoger-clases/escoger-asignaturas', component: EscogerAsignaturasProfesorPage},
      { path: 'alumno', component: RegistroAlumnoPage},
      { path: 'alumno/escoger-clase', component: EscogerClaseAlumnoPage},
    ]
  },
  { path: 'tabs-centro-educativo', component: TabsCentroEducativoComponent,
    children: [
      { path: 'principal', component: PantallaPrincipalCentroEducativoPage},
      { path: 'profesores', component: ProfesoresCentroEducativoPage},
      { path: 'clases', component: ClasesCentroEducativoPage},
      { path: 'clases/profesores', component: ProfesoresClaseCentroEducativoPage},
      { path: 'clases/alumnos', component: ClaseAlumnosCentroEducativoPage},
      { path: 'clases/alumnos/notas', component: ClaseAlumnosNotasCentroEducativoPage},
      { path: 'perfil', component: PerfilCentroEducativoPage},
      { path: 'perfil/editar-perfil', component: EditarPerfilCentroEducativoPage},
      { path: 'perfil/codigos', component: CodigosCentroEducativoPage},
      { path: 'perfil/ajustes', component: AjustesCentroEducativoPage},
    ]
  },
  { path: 'tabs-profesor', component: TabsProfesorComponent,
    children: [
      { path: 'principal', component: PantallaPrincipalProfesorPage},
      { path: 'clases', component: MisClasesProfesorPage},
      { path: 'clases/alumnos', component: MisAlumnosProfesorPage},
      { path: 'clases/alumnos/notas', component: NotasAlumnosProfesorPage},
      { path: 'clases/alumnos/notas/comprobar-examen', component: ComprobarExamenProfesorPage},
      { path: 'clases/examenes', component: MisExamenesProfesorPage},
      { path: 'clases/crear-examen', component: CrearExamenProfesorPage},
      { path: 'perfil', component: PerfilProfesorPage},
      { path: 'perfil/editar-perfil', component: EditarPerfilProfesorPage},
      { path: 'perfil/configuracion-clases', component: EscogerClasesConfigProfesorPage},
      { path: 'perfil/configuracion-clases/asignaturas', component: EscogerAsignaturasConfigProfesorPage},
      { path: 'perfil/ajustes', component: AjustesProfesorPage}
    ]
  },
  { path: 'tabs-alumno', component: TabsAlumnoComponent,
    children: [
      { path: 'principal', component: PantallaPrincipalAlumnoPage},
      { path: 'asignaturas', component: MisAsignaturasAlumnoPage},
      { path: 'asignaturas/info-asignatura', component: InfoAsignaturaAlumnoPage},
      { path: 'asignaturas/info-asignatura/examenes', component: MisExamenesAlumnoPage},
      { path: 'asignaturas/info-asignatura/examenes/hacer-examen', component: HacerExamenAlumnoPage},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
