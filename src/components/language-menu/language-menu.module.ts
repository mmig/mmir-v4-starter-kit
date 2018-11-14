import { NgModule } from '@angular/core';
import { IonicPageModule } from "ionic-angular";
import { LanguageMenu } from './language-menu';
@NgModule({
	declarations: [LanguageMenu],
	imports: [IonicPageModule.forChild(LanguageMenu)],
	exports: [LanguageMenu]
})
export class LanguageMenuModule {}
