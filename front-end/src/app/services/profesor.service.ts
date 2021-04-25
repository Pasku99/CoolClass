import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Profesor } from '../models/profesor.model';
import { loginForm } from '../interfaces/login-form.interface';
const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  public profesor: Profesor;
  user = null;
  authenticationState = new BehaviorSubject(false);
  public autenticado = false;

  constructor(private http: HttpClient, private router: Router, private helper: JwtHelperService, private storage: Storage,
              private plt: Platform, private alertController: AlertController) {
              this.plt.ready().then(() => {
                this.checkToken();
              });}

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.autenticado = true;
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  nuevoProfesor ( data: Profesor) {
    return this.http.post(`${environment.base_url}/profesores`, data, this.cabecerasVacia);
  }

  loginProfesor( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login/profesor`, formData)
    .pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res['token']);
        this.user = this.helper.decodeToken(res['token']);
        this.profesor = new Profesor(res['uid'], res['rol']);
        this.authenticationState.next(true);
        this.autenticado = true;
      })
    );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      this.autenticado = false;
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
    // return this.autenticado;
  }

  getSpecialData() {
    return this.http.get(`${environment.base_url}/login/tokenprofesor`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  cogerToken(){
    this.storage.get(TOKEN_KEY).then((result) => {
      return this.http.get(`${environment.base_url}/login/tokenprofesor`, {
        headers: {'x-token': result}
      }).subscribe(res => {
        this.profesor = new Profesor(res['uid'], res['nombre'], res['email'], res['rol'], res['uidCentro'], res['token']);
      });
    });
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
    return this.profesor.token || '';
  }

  get uid(): string {
    return this.profesor.uid;
  }

  get rol(): string {
    return this.profesor.rol;
  }

  get nombre(): string{
    return this.profesor.nombre;
  }

  get email(): string{
    return this.profesor.email;
  }

  get uidCentro(): string{
    return this.profesor.uidCentro;
  }

}