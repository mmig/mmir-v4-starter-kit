import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login-page';
import { LanguageMenuModule } from '../../components/language-menu/language-menu.module';
import { SpeechCmdBtnModule } from '../../components/speech-cmd-button/speech-cmd-btn.module';

@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    LanguageMenuModule,
    SpeechCmdBtnModule,
  ],
  exports: [
    LoginPage,
  ]
})
export class LoginPageModule {}
