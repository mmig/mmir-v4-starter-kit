import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login-page/login-page';
import { RegistrationPage } from '../pages/registration-page/registration-page';
import { WelcomePage } from '../pages/welcome-page/welcome-page';
import { CalendarPage } from '../pages/calendar-page/calendar-page';
// import { Page1 } from '../pages/page1/page1';
// import { Page2 } from '../pages/page2/page2';

import { FabMiclevels } from './../components/fab-miclevels/fab-miclevels';
import { LanguageMenu } from './../components/language-menu/language-menu';

import { MmirProvider } from '../providers/mmir';
import { VoiceUIProvider } from '../providers/mmir';
import { AppConfig } from '../providers/app-config';
import { UserAuthProvider } from './../providers/user-auth';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegistrationPage,
    WelcomePage,
    CalendarPage,
    FabMiclevels,
    LanguageMenu
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegistrationPage,
    WelcomePage,
    CalendarPage,
    LanguageMenu
  ],
  providers: [
    Storage, MmirProvider, VoiceUIProvider, AppConfig, UserAuthProvider,
    StatusBar, SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
