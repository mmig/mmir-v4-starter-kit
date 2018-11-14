import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarPage } from './calendar-page';
import { SpeechCmdBtnModule } from '../../components/speech-cmd-button/speech-cmd-btn.module';

@NgModule({
  declarations: [
    CalendarPage
  ],
  imports: [
    IonicPageModule.forChild(CalendarPage),
    SpeechCmdBtnModule,
  ],
  exports: [
    CalendarPage,
  ]
})
export class CalendarPageModule {}
