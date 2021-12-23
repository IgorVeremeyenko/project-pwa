import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from './interceptors/cors.interceptor';
import { AuthComponent } from './auth/auth.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LoginComponent } from './dialogs/login/login.component';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { DetailsComponent } from './dialogs/details/details.component';
import { ListComponent } from './components/list/list.component';
import { ReadyNoPipe } from './ready-no.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { SureComponent } from './dialogs/sure/sure.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { HomeComponent } from './components/home/home.component';
import { AuthModule } from './auth/auth.module';
import { LoginByPhoneComponent } from './dialogs/login-by-phone/login-by-phone.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { IntroComponent } from './dialogs/intro/intro.component';

registerLocaleData(localeRu, 'ru');

export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,    
    LoginComponent,
    LogoutComponent,
    DetailsComponent,
    ListComponent,
    ReadyNoPipe,
    FooterComponent,
    SureComponent,
    UnauthorizedComponent,
    LoginByPhoneComponent,
    AddClientComponent,
    IntroComponent
  ],
  imports: [
    TextMaskModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),
    ServiceWorkerModule.register('../ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    }),
    LottieModule.forRoot({ player: playerFactory }),
    AuthModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CorsInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
    registerLocaleData(localeRu, 'ru');
  }
 }
