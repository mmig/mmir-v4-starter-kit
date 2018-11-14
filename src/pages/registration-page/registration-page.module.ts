import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationPage } from './registration-page';
import { SpeechCmdBtnModule } from '../../components/speech-cmd-button/speech-cmd-btn.module';

@NgModule({
  declarations: [
    RegistrationPage
  ],
  imports: [
    IonicPageModule.forChild(RegistrationPage),
    SpeechCmdBtnModule,
  ],
  exports: [
    RegistrationPage,
  ]
})
export class RegistrationPageModule {}
