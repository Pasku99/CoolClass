import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Alumno } from '../models/alumno.model';
import { loginForm } from '../interfaces/login-form.interface';
import { AuthService } from './auth.service';
const TOKEN_KEY = 'access_token';


@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  public alumno: Alumno;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor (private http: HttpClient, private router: Router, private helper: JwtHelperService, private storage: Storage,
    private plt: Platform, private alertController: AlertController, private authService: AuthService){
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

  nuevoAlumno ( data: Alumno) {
    return this.http.post(`${environment.base_url}/alumnos`, data, this.cabecerasVacia);
  }

  cargarAlumno( uid: string ){
    return this.http.get(`${environment.base_url}/alumnos/?id=${uid}`, this.cabeceras);
  }

  actualizarAlumno( uid: string, data ){
    return this.http.put(`${environment.base_url}/alumnos/${uid}`, data, this.cabeceras);
  }

  escogerClase (data) {
    return this.http.post(`${environment.base_url}/alumnos/escogerClase`, data, this.cabeceras);
  }

  establecerClase( uidClase: string, nombreClase: string ): void {
    this.authService.alumno.uidClase = uidClase;
    this.authService.alumno.nombreClase = nombreClase;
  }

  cargarClasesCentro(uidCentro: string, filtro?: string, idAlumno?: string,){
    return this.http.get(`${environment.base_url}/centroeducativo/${uidCentro}/clases/?nombre=${filtro}&idAlumno=${idAlumno}`, this.cabeceras);
  }

  cargarAsignaturasAlumno(uidAlumno: string, uidClase: string, filtro?: string) {
    if(!filtro){
      filtro = '';
    }
    return this.http.get(`${environment.base_url}/alumnos/obtenerclase/${uidAlumno}/${uidClase}/?asignatura=${filtro}`, this.cabeceras);
  }

  cargarProfesor(uidAlumno: string, uidProfesor: string) {
    return this.http.get(`${environment.base_url}/alumnos/${uidAlumno}/profesor/?id=${uidProfesor}`, this.cabeceras);
  }

  cargarProximosExamenesAlumno(uidAlumno: string, uidProfesor: string, uidClase: string, limitado?: string, nombreExamen?: string){
    if(!limitado){
      limitado = '';
    }
    if(!nombreExamen){
      nombreExamen = '';
    }
    return this.http.get(`${environment.base_url}/examenes/examenesalumno/${uidAlumno}/${uidProfesor}/${uidClase}/?limitado=${limitado}&nombreExamen=${nombreExamen}`, this.cabeceras);
  }

  cargarNotasAsignaturaAlumno(uidProfesor:string, uidAlumno: string, filtro?: string, nombreExamen?: string){
    if(!filtro){
      filtro = '';
    }
    if(!nombreExamen){
      nombreExamen = '';
    }
    return this.http.get(`${environment.base_url}/examenes/notas/${uidProfesor}/${uidAlumno}/?limitado=${filtro}&nombreExamen=${nombreExamen}`, this.cabeceras);
  }

  cargarExamenAlumno(uidExamen: string, uidAlumno: string, uidCentro: string){
    return this.http.get(`${environment.base_url}/examenes/examen/${uidExamen}/?idAlumno=${uidAlumno}&idCentro=${uidCentro}`, this.cabeceras);
  }

  enviarExamenResuelto(data){
    return this.http.post(`${environment.base_url}/examenes/examenresuelto`, data, this.cabeceras);
  }

  cargarUltimosExamenesAlumno(uidAlumno: string, filtro?:string){
    if(!filtro){
      filtro = '';
    }
    return this.http.get(`${environment.base_url}/examenes/ultimosexamenesalumno/${uidAlumno}/?limitado=${filtro}`, this.cabeceras);
  }

  cargarTodosProximosExamenesAlumno(uidAlumno: string, uidClase: string, filtro?:string){
    if(!filtro){
      filtro = '';
    }
    return this.http.get(`${environment.base_url}/examenes/proximosexamenesalumno/${uidClase}/${uidAlumno}/?limitado=${filtro}`, this.cabeceras);
  }

  loginAlumno( formData: loginForm) {
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
      return this.http.get(`${environment.base_url}/login/tokenalumno`, {
        headers: {'x-token': result}
      }).subscribe(res => {
        this.alumno = new Alumno(res['uid'], res['nombre'], res['email'], res['rol'], res['uidCentro'], res['uidClase'], res['nombreClase'], res['token']);
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
        'x-token': this.authService.alumno.token,
      }};
  }

  get token(): string {
    return this.authService.alumno.token || '';
  }

  get uid(): string {
    return this.authService.alumno.uid;
  }

  get rol(): string {
    return this.authService.alumno.rol;
  }

  get nombre(): string{
    return this.authService.alumno.nombre;
  }

  get nombreClase(): string{
    return this.authService.alumno.nombreClase;
  }

  get email(): string{
    return this.authService.alumno.email;
  }

  get uidCentro(): string{
    return this.authService.alumno.uidCentro;
  }

  get uidClase(): string{
    return this.authService.alumno.uidClase;
  }

}
