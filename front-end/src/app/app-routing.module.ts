import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainRoutingModule } from './main/main.routing';
import { PagesRoutingModule } from './pages/pages.routing';


const routes: Routes = [
  {
    path: '**',
    redirectTo: 'inicio',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MainRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
