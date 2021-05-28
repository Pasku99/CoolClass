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
import { CentroeducativoService } from '../services/centroeducativo.service';
import { RecuperarPasswordPage } from './recuperar-password/recuperar-password.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    InicioComponent,
    InicioSesionPage,
    RegistroPage,
    RecuperarPasswordPage
  ],
  exports: [
    InicioComponent,
    InicioSesionPage,
    RegistroPage,
    RecuperarPasswordPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule
  ]
})

export class MainModule { }
