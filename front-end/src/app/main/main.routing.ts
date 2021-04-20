import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { InicioSesionPage } from './inicio-sesion/inicio-sesion.page';
import { RegistroPage } from './registro/registro.page';
import { NoauthCentroGuard } from '../guards/noauthcentro.guard';

const routes: Routes = [
  { path: 'inicio', component: BlankLayoutComponent, canActivate: [ NoauthCentroGuard ],
    children: [
      { path: '', component: InicioComponent},
    ]
  },
  { path: 'inicio-sesion', component: BlankLayoutComponent, canActivate: [ NoauthCentroGuard ],
    children: [
      { path: '', component: InicioSesionPage},
    ]
  },
  { path: 'escoger-registro', component: BlankLayoutComponent, canActivate: [ NoauthCentroGuard ],
    children: [
      { path: '', component: RegistroPage},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
