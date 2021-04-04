import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainRoutingModule } from './main/main.routing';


const routes: Routes = [

  //  /login y /recovery  --> authroutingmodule
  //  /admin/* /children/* /tutor/*        --> pagesroutingmodule

  { path: '**', redirectTo: 'blank'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MainRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
