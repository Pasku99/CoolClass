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

const routes: Routes = [
  { path: 'registro', component: BlankLayoutComponent,
    children: [
      { path: 'centro-educativo', component: RegistroCentroEducativoPage},
      { path: 'profesor', component: RegistroProfesorPage},
      { path: 'alumno', component: RegistroAlumnoPage},
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
