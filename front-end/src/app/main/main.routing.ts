import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';

const routes: Routes = [
  { path: 'blank', component: BlankLayoutComponent,
    children: [
      { path: '', component: InicioComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
