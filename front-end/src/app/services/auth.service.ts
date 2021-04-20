import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { CentroEducativo } from '../models/centroeducativo.model';
import { tap, map, catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { Observable, of } from 'rxjs';
const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private centro: CentroEducativo;

  constructor(private http: HttpClient,
            private router: Router) { }

  buscarTipo ( data ) {
    return this.http.post(`${environment.base_url}/login/buscartipo`, data, this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token,
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
}
