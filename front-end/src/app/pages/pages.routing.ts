import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { RegistroCentroEducativoPage } from './centro-educativo/registro-centro-educativo/registro-centro-educativo.page';
import { RegistroProfesorPage } from './profesor/registro-profesor/registro-profesor.page';
import { RegistroAlumnoPage } from './alumno/registro-alumno/registro-alumno.page';

const routes: Routes = [
  { path: 'registro', component: BlankLayoutComponent,
    children: [
      { path: 'centro-educativo', component: RegistroCentroEducativoPage},
      { path: 'profesor', component: RegistroProfesorPage},
      { path: 'alumno', component: RegistroAlumnoPage},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
