import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { CentroEducativo } from '../models/centroeducativo.model';
import { tap, map, catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import { Observable, of } from 'rxjs';
import { Clase } from '../models/clase.model';

@Injectable({
  providedIn: 'root'
})
export class CentroeducativoService {

  private centro: CentroEducativo;
  public tokenC: string;

  constructor( private http: HttpClient,
               private router: Router ) { }

  nuevoCentro ( data: CentroEducativo) {
    return this.http.post(`${environment.base_url}/centroeducativo`, data, this.cabeceras);
  }

  nuevaClase(data) {
    return this.http.post(`${environment.base_url}/centroeducativo/clases`, data, this.cabeceras);
  }

  cargarClases ( filtro: string, uid: string) {
    return this.http.get(`${environment.base_url}/centroeducativo/${uid}/clases`, this.cabeceras);
  }

  loginCentroEducativo( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login/centroeducativo`, formData)
            .pipe(
              tap( (res : any) => {
                // localStorage.setItem('token', res['token']);
                this.setToken(res['token']);
                const {uid, rol} = res;
                this.centro = new CentroEducativo(uid, rol);
                this.getToken();
              })
            );
  }

  async setToken(token) {
    await Storage.set({
      key: 'token',
      value: token
    });
  }

  async removeToken() {
    await Storage.remove({ key: 'token' });
  }

  validarCentro(correcto: boolean, incorrecto: boolean): Observable<boolean> {
    if (this.token === '') {
      console.log('Por aqui');
      this.removeToken();
      return of(incorrecto);
    }
    return this.http.get(`${environment.base_url}/login/tokencentro`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, nombre, email, rol, codigoProfesor, codigoAlumno, token } = res;
          this.setToken(token);
          this.centro = new CentroEducativo(uid, nombre, email, rol, codigoProfesor, codigoAlumno);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.removeToken();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    return this.validarCentro(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validarCentro(false, true);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.tokenC,
      }};
  }

  get token(): string {
    // return localStorage.getItem('token') || '';
    return this.tokenC;
  }

  async getToken() {
    const token = await Storage.get({ key: 'token' });
    this.tokenC = token.value;
  }

  get uid(): string {
    return this.centro.uid;
  }

  get rol(): string {
    return this.centro.rol;
  }

  get nombre(): string{
    return this.centro.nombre;
  }

  get email(): string{
    return this.centro.email;
  }

  // get imagen(): string{
  //   return this.centro.imagen;
  // }

}
