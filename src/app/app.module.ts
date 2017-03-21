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

import { MmirProvider } from '../providers/mmir';
import { AppConfig } from '../providers/app-config';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegistrationPage,
    WelcomePage,
    CalendarPage,
    // Page1,
    // Page2,
    FabMiclevels
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
    CalendarPage
    // Page1,
    // Page2
  ],
  providers: [Storage, MmirProvider, AppConfig]
})
export class AppModule {}
