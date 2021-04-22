import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { Storage } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { PagesModule } from './pages/pages.module';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { TabsCentroEducativoComponent } from './layouts/tabs-centro-educativo/tabs-centro-educativo.component';
import { TabsProfesorComponent } from './layouts/tabs-profesor/tabs-profesor.component';
import { TabsAlumnoComponent } from './layouts/tabs-alumno/tabs-alumno.component';

import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CentroeducativoService } from './services/centroeducativo.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['http://192.168.0.211:3000']
  }
}

@NgModule({
  declarations: [AppComponent, BlankLayoutComponent, TabsCentroEducativoComponent, TabsProfesorComponent, TabsAlumnoComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, MainModule, RouterModule, IonicModule, PagesModule, HttpClientModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    })],
  providers: [ StatusBar, SplashScreen, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
