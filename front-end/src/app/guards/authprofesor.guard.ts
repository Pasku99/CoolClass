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

  canActivate(): boolean {
    return this.profesorService.isAuthenticated();
  }

}
