import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
    IonicModule.forRoot(MyApp)
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
  providers: [Storage, MmirProvider, AppConfig, UserAuthProvider]
})
export class AppModule {}
