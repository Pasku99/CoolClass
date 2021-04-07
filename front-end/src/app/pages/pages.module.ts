import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { RegistroCentroEducativoPage } from './centro-educativo/registro-centro-educativo/registro-centro-educativo.page';
import { RegistroProfesorPage } from './profesor/registro-profesor/registro-profesor.page';
import { RegistroAlumnoPage } from './alumno/registro-alumno/registro-alumno.page';

@NgModule({
  declarations: [
    RegistroCentroEducativoPage,
    RegistroProfesorPage,
    RegistroAlumnoPage
  ],
  exports: [
    RegistroCentroEducativoPage,
    RegistroProfesorPage,
    RegistroAlumnoPage
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
