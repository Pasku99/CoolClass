import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CentroEducativo } from '../models/centroeducativo.model';
import { loginForm } from '../interfaces/login-form.interface';
import { Profesor } from '../models/profesor.model';
import { Alumno } from '../models/alumno.model';
const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public profesor: Profesor;
  public centro: CentroEducativo;
  public alumno: Alumno;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor (private http: HttpClient, private router: Router, private helper: JwtHelperService, private storage: Storage,
        private plt: Platform, private alertController: AlertController){
          this.plt.ready().then(() => {
                this.checkToken();
              });
        }


  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  loginCentroEducativo( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login/centroeducativo`, formData)
    .pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res['token']);
        this.user = this.helper.decodeToken(res['token']);
        this.centro = new CentroEducativo(res['uid'], res['rol']);
        this.authenticationState.next(true);
      })
    );
  }

  loginProfesor( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login/profesor`, formData)
    .pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res['token']);
        this.user = this.helper.decodeToken(res['token']);
        this.profesor = new Profesor(res['uid'], res['rol']);
        this.authenticationState.next(true);
      })
    );
  }

  loginAlumno( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login/alumno`, formData)
    .pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res['token']);
        this.user = this.helper.decodeToken(res['token']);
        this.alumno = new Alumno(res['uid'], res['rol']);
        this.authenticationState.next(true);
      })
    );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  async cogerToken(){
    await this.storage.get(TOKEN_KEY).then((result) => {
      if(result != null || result != undefined){
        return this.http.get(`${environment.base_url}/login/token`, {
          headers: {'x-token': result}
        }).subscribe(res => {
          if(res){
            if(res['rol'] == 'ROL_CENTRO'){
              this.centro = new CentroEducativo(res['uid'], res['nombre'], res['email'], res['rol'], res['codigoProfesor'], res['codigoAlumno'], res['token']);
              this.router.navigateByUrl('tabs-centro-educativo/principal');
            } else if(res['rol'] == 'ROL_PROFESOR'){
              this.profesor = new Profesor(res['uid'], res['nombre'], res['email'], res['rol'], res['uidCentro'], res['token']);
              this.router.navigateByUrl('tabs-profesor/principal');
            } else if(res['rol'] == 'ROL_ALUMNO'){
              this.alumno = new Alumno(res['uid'], res['nombre'], res['email'], res['rol'], res['uidCentro'], res['uidClase'], res['nombreClase'], res['token']);
              this.router.navigateByUrl('tabs-alumno/principal');
            }
          }
        });
      }
    });
  }

  buscarTipo ( data ) {
    return this.http.post(`${environment.base_url}/login/buscartipo`, data);
  }

  recoverPassword(data){
    return this.http.post(`${environment.base_url}/login/recovery`, data, this.cabecerasVacia);
  }

  establecercodigoProfesor( codigoProfesor: string ): void {
    this.centro.codigoProfesor = codigoProfesor;
  }

  establecercodigoAlumno( codigoAlumno: string ): void {
    this.centro.codigoAlumno = codigoAlumno;
  }

  establecerdatosCentro( nombre: string, email: string ): void {
    this.centro.nombre = nombre;
    this.centro.email = email;
  }

  establecerdatosProfesor( nombre: string, email: string ): void {
    this.profesor.nombre = nombre;
    this.profesor.email = email;
  }

  establecerdatosAlumno( nombre: string, email: string ): void {
    this.alumno.nombre = nombre;
    this.alumno.email = email;
  }

  get cabecerasVacia() {
    return {
      headers: {
        'x-token': '',
      }};
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
