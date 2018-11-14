import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { SpeechCmdBtnComponent } from './speech-cmd-btn';
import { FabMiclevelsModule } from '../fab-miclevels/fab-miclevels.module';
@NgModule({
	declarations: [SpeechCmdBtnComponent],
	imports: [IonicModule, FabMiclevelsModule],
	exports: [SpeechCmdBtnComponent]
})
export class SpeechCmdBtnModule {}
