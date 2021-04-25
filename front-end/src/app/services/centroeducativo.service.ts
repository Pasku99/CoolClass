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
import { AuthService } from './auth.service';
const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class CentroeducativoService {

  public centro: CentroEducativo;
  public tokenC: string;
  user = null;
  authenticationState = new BehaviorSubject(false);
  public autenticado = false;

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
          this.autenticado = true;
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  nuevoCentro ( data: CentroEducativo) {
    return this.http.post(`${environment.base_url}/centroeducativo`, data, this.cabeceras);
  }

  nuevaClase(data) {
    return this.http.post(`${environment.base_url}/centroeducativo/clases`, data, this.cabeceras);
  }

  cargarClases ( uid: string, filtro?: string): Observable<object> {
    return this.http.get(`${environment.base_url}/centroeducativo/${uid}/clases/?nombre=${filtro}`, this.cabeceras);
  }

  cargarCentro ( uid: string ) {
    return this.http.get(`${environment.base_url}/centroeducativo/?id=${uid}`, this.cabeceras);
  }

  actualizarCentro( uid: string, data ){
    return this.http.put(`${environment.base_url}/centroeducativo/${uid}`, data, this.cabeceras);
  }

  establecerdatos( nombre: string, email: string ): void {
    this.centro.nombre = nombre;
    this.centro.email = email;
  }

  generarCodigoProfesor( data ){
    return this.http.put(`${environment.base_url}/centroeducativo/generarcodigoprofesor`, data, this.cabeceras);
  }

  establecercodigoProfesor( codigoProfesor: string ): void {
    this.centro.codigoProfesor = codigoProfesor;
  }

  generarCodigoAlumno( data ){
    return this.http.put(`${environment.base_url}/centroeducativo/generarcodigoalumno`, data, this.cabeceras);
  }

  establecercodigoAlumno( codigoAlumno: string ): void {
    this.centro.codigoAlumno = codigoAlumno;
  }

  loginCentroEducativo( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login/centroeducativo`, formData)
    .pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res['token']);
        this.user = this.helper.decodeToken(res['token']);
        this.centro = new CentroEducativo(res['uid'], res['rol']);
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

  getSpecialData() {
    return this.http.get(`${environment.base_url}/login/tokencentro`).pipe(
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

  isAuthenticated() {
    return this.authenticationState.value;
    // return this.autenticado;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  // async setToken(token) {
  //   await Storage.set({
  //     key: 'token',
  //     value: token
  //   });
  // }

  // async removeToken() {
  //   await Storage.remove({ key: 'token' });
  // }

  cogerToken(){
    this.storage.get(TOKEN_KEY).then((result) => {
      return this.http.get(`${environment.base_url}/login/tokencentro`, {
        headers: {'x-token': result}
      }).subscribe(res => {
        this.centro = new CentroEducativo(res['uid'], res['nombre'], res['email'], res['rol'], res['codigoProfesor'], res['codigoAlumno'], res['token']);
      });
    });
  }

  validarCentro(correcto: boolean, incorrecto: boolean): Observable<boolean> {
    // if (this.token === '') {
    //   console.log('Por aqui');
    //   // this.removeToken();
    //   return of(incorrecto);
    // }
    return this.http.get(`${environment.base_url}/login/tokencentro`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, nombre, email, rol, codigoProfesor, codigoAlumno, token } = res;
          // this.setToken(token);
          this.centro = new CentroEducativo(uid, nombre, email, rol, codigoProfesor, codigoAlumno);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          // this.removeToken();
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
    return this.authService.centro.token || '';
  }

  // async getToken() {
  //   const token = await Storage.get({ key: 'token' });
  //   this.tokenC = token.value;
  // }

  get uid(): string {
    return this.authService.centro.uid;
  }

  get rol(): string {
    return this.authService.centro.rol;
  }

  get nombre(): string{
    return this.authService.centro.nombre;
  }

  get email(): string{
    return this.authService.centro.email;
  }

  get codigoProfesor(): string{
    return this.authService.centro.codigoProfesor;
  }

  get codigoAlumno(): string{
    return this.authService.centro.codigoAlumno;
  }

  // get imagen(): string{
  //   return this.centro.imagen;
  // }

}
