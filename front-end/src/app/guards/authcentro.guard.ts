import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CentroeducativoService } from '../services/centroeducativo.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthcentroGuard implements CanActivate {

  constructor( private centroeducativoService: CentroeducativoService,
               private router: Router,
               private authService: AuthService) {}

  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }

}
