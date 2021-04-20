import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CentroeducativoService } from '../services/centroeducativo.service';

@Injectable({
  providedIn: 'root'
})
export class NoauthCentroGuard implements CanActivate {

  constructor( private centroeducativoService: CentroeducativoService,
                private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.centroeducativoService.validarNoToken()
              .pipe(
                tap( resp => {
                  if (!resp) {
                    if(this.centroeducativoService.rol == 'ROL_CENTRO'){
                      this.router.navigateByUrl('/tabs-centro-educativo/principal');
                    }
                  }
                })
              );
  }
}
