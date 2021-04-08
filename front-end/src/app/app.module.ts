import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { PagesModule } from './pages/pages.module';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { TabsCentroEducativoComponent } from './layouts/tabs-centro-educativo/tabs-centro-educativo.component';


@NgModule({
  declarations: [AppComponent, BlankLayoutComponent, TabsCentroEducativoComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, MainModule, RouterModule, IonicModule, PagesModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
