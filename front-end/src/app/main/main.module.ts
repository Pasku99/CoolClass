import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './inicio/inicio.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';

@NgModule({
  declarations: [
    BlankLayoutComponent,
    InicioComponent
  ],
  exports: [
    BlankLayoutComponent,
    InicioComponent
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
