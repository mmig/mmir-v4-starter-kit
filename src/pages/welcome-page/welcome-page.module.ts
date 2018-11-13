import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome-page';

@NgModule({
  declarations: [
    WelcomePage
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
  ],
  exports: [
    WelcomePage,
  ]
})
export class WelcomePageModule {
}
