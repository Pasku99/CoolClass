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
import { AuthService } from './auth.service';
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
              private authService: AuthService, private plt: Platform, private alertController: AlertController) {
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

  cargarAsignaturas(){
    return this.http.get(`${environment.base_url}/profesores/asignaturas`, this.cabecerasVacia);
  }

  cargarClasesCentro( uidCentro: string, uidProfesor: string ){
    return this.http.get(`${environment.base_url}/profesores/clases/${uidCentro}/${uidProfesor}`, this.cabeceras);
  }

  cargarClasesProfesor( uidCentro: string, uidProfesor: string, filtro?: string ){
    return this.http.get(`${environment.base_url}/profesores/clasesprofesor/${uidCentro}/${uidProfesor}/?nombre=${filtro}`, this.cabeceras);
  }

  anyadirClaseProfesor( data ) {
    return this.http.post(`${environment.base_url}/profesores/escogerclases`, data, this.cabeceras);
  }

  actualizarProfesor( uid: string, data ){
    return this.http.put(`${environment.base_url}/profesores/${uid}`, data, this.cabeceras);
  }

  escogerAsignaturas( data ) {
    return this.http.post(`${environment.base_url}/profesores/escogerasignaturas`, data, this.cabeceras);
  }

  eliminarClaseAsignaturaProfesor( data ) {
    return this.http.put(`${environment.base_url}/profesores/eliminarclaseprofesor`, data, this.cabeceras);
  }

  cargarAlumnosClase( uidCentro: string, uidClase: string, uidProfesor?: string, filtro?: string ) {
    if(!filtro){
      filtro = '';
    }
    if(!uidProfesor){
      uidProfesor = '';
    }
    return this.http.get(`${environment.base_url}/alumnos/${uidCentro}/${uidClase}/?nombre=${filtro}&idProfesor=${uidProfesor}`, this.cabeceras);
  }

  cargarClasesUid ( uid: string, uidProfesor?: string, filtro?: string): Observable<object> {
    return this.http.get(`${environment.base_url}/centroeducativo/${uid}/clases/?idClase=${filtro}&idProfesor=${uidProfesor}`, this.cabeceras);
  }

  cargarExamenesClaseProfesor( uidProfesor: string, uidClase: string){
    return this.http.get(`${environment.base_url}/examenes/examenesprofesor/${uidProfesor}/${uidClase}`, this.cabeceras);
  }

  cargarNotasExamen( uidExamen: string, uidProfesor: string){
    return this.http.get(`${environment.base_url}/examenes/notas/${uidExamen}/?idProfesor=${uidProfesor}`, this.cabeceras);
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
        'x-token': this.authService.profesor.token,
      }};
  }

  get token(): string {
    return this.authService.profesor.token || '';
  }

  get uid(): string {
    return this.authService.profesor.uid;
  }

  get rol(): string {
    return this.authService.profesor.rol;
  }

  get nombre(): string{
    return this.authService.profesor.nombre;
  }

  get email(): string{
    return this.authService.profesor.email;
  }

  get uidCentro(): string{
    return this.authService.profesor.uidCentro;
  }

}
