import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { InicioSesionPage } from './inicio-sesion/inicio-sesion.page';

const routes: Routes = [
  { path: '', component: BlankLayoutComponent,
    children: [
      { path: 'blank', component: InicioComponent},
    ]
  },
  { path: '', component: BlankLayoutComponent,
    children: [
      { path: 'inicio-sesion', component: InicioSesionPage},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
