import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CentroEducativo } from '../models/centroeducativo.model';

@Injectable({
  providedIn: 'root'
})
export class CentroeducativoService {

  private centro: CentroEducativo;

  constructor( private http: HttpClient,
               private router: Router ) { }

  nuevoCentro ( data: CentroEducativo) {
    return this.http.post(`${environment.base_url}/centroeducativo`, data, this.cabeceras);
  }

  limpiarLocalStorage(): void{
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
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
