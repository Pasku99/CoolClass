import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { InicioSesionPage } from './inicio-sesion/inicio-sesion.page';
import { RegistroPage } from './registro/registro.page';
import { RecuperarPasswordPage } from './recuperar-password/recuperar-password.page';

const routes: Routes = [
  { path: 'inicio', component: BlankLayoutComponent,
    children: [
      { path: '', component: InicioComponent},
    ]
  },
  { path: 'inicio-sesion', component: BlankLayoutComponent,
    children: [
      { path: '', component: InicioSesionPage},
    ]
  },
  { path: 'escoger-registro', component: BlankLayoutComponent,
    children: [
      { path: '', component: RegistroPage},
    ]
  },
  { path: 'recuperar-password', component: BlankLayoutComponent,
    children: [
      { path: '', component: RecuperarPasswordPage},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
