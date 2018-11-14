import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import {MmirPage} from './../../models/MmirBasePage';
import {MmirProvider, VoiceUIProvider} from './../../providers/mmir';

@IonicPage()
@Component({
  selector: 'calendar-page',
  templateUrl: 'calendar-page.html'
})
export class CalendarPage extends MmirPage {

  public subject: string = '';
  public note: string = '';
  public dateStart =  new Date().toISOString();
  public dateEnd =  new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    ref: ChangeDetectorRef,
    vuiCtrl: VoiceUIProvider<any>,
    mmirProvider: MmirProvider<any>
  ) {
    super(vuiCtrl, mmirProvider, ref);
  }

  ionViewDidLoad() {
    console.log('Hello CalendarPage Page');
  }

  saveAppointment(){

    const dateStart = new Date(this.dateStart);
    const year = dateStart.getFullYear();
    const month = dateStart.getMonth();
    const day = dateStart.getDay();
    const start_h = dateStart.getHours();
    const start_m = dateStart.getMinutes();

    const dateEnd = new Date(this.dateEnd);
    const end_h = dateEnd.getHours();
    const end_m = dateEnd.getMinutes();

    const eventData = '{"subject":"' + this.subject + '","year":"' + year +
                    '","month":"' + month+'","day":"' + day +
                    '","start_hours":"' + start_h+'","start_minutes":"' + start_m +
                    '","end_hours":"' + end_h+'","end_minutes":"' + end_m+
                    '","note":"' + this.note + '"}';

    var jData = JSON.parse(eventData);

    var cb_func = () => {

      let alert = this.alertCtrl.create({
        title: 'STUB: appointment successfully created!',
        message: JSON.stringify(jData, null, 2),
        buttons: [{
          text: this.lang.getText('buttonOk'),
          handler: () => {
            this.vuiCtrl.ctrl.triggerTouchFeedback({type: 'click'});
          }
        }]
      });

      alert.present();

    };

    this.mmir.model.get('CalendarModel').getInstance().save_appointment(jData, cb_func);
  }

}
