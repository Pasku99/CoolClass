import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ProfesorService } from '../services/profesor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthprofesorGuard implements CanActivate {

  constructor( private profesorService: ProfesorService,
               private router: Router) {}

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot) {
  //     return this.centroeducativoService.validarToken()
  //             .pipe(
  //               tap( resp => {
  //                 // Si devuelve falso, el token no es bueno, salimos a login
  //                 if (!resp) {
  //                   console.log('Aqui')
  //                 }
  //                 // else if(this.usuarioService.verificado == false){
  //                 //   Swal.fire({
  //                 //     title: '¡Error de verificación!',
  //                 //     text: 'El usuario no se encuentra verificado. Verifique su email antes de iniciar sesión',
  //                 //     icon: 'error',
  //                 //     confirmButtonText: 'Ok',
  //                 //     allowOutsideClick: false
  //                 //   }).then((result) => {
  //                 //     if(result.value){
  //                 //       localStorage.removeItem('token');
  //                 //       this.router.navigateByUrl('/login');
  //                 //     }
  //                 //   });
  //                 // }
  //                 else {
  //                   // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
  //                   if ((next.data.rol !== '*') && (this.centroeducativoService.rol !== next.data.rol)) {
  //                     if(this.centroeducativoService.rol == 'ROL_CENTRO'){
  //                       this.router.navigateByUrl('/tabs-centro-educativo/principal');
  //                     }
  //                  }
  //                 }
  //               })
  //             );
  // }
  canActivate(): boolean {
    return this.profesorService.isAuthenticated();
  }

}
