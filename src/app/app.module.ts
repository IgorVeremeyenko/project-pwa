import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
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
import { AsyncPipe, registerLocaleData } from '@angular/common';
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
import { ListForUserComponent } from './components/list-for-user/list-for-user.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PromptComponent } from './prompt-component/prompt-component.component';
import { PwaService } from './services/pwa.service';
import { MessagingService } from './services/messaging.service';

registerLocaleData(localeRu, 'ru');

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

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
    IntroComponent,
    ListForUserComponent,
    MainNavComponent,
    PromptComponent
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
    AuthModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CorsInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'ru' },
    {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true},
    MessagingService,AsyncPipe
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
