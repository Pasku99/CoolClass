import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './inicio/inicio.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { InicioSesionPage } from './inicio-sesion/inicio-sesion.page';
import { RegistroPage } from './registro/registro.page';

@NgModule({
  declarations: [
    InicioComponent,
    InicioSesionPage,
    RegistroPage
  ],
  exports: [
    InicioComponent,
    InicioSesionPage,
    RegistroPage
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

export class MainModule { }
