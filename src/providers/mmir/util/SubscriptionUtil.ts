
import { SpeechEventName , IonicMmirModule } from '../typings/mmir-ionic.d';
import { Subscription } from 'rxjs/Subscription';

export class SubscriptionUtil {

  constructor(private mmir: IonicMmirModule<any>){}

  public subscribe(subscriptions: Array<SpeechEventName>, handler: any): Map<SpeechEventName, Subscription> {
    const speechSubs: Map<SpeechEventName, Subscription> = new Map<SpeechEventName, Subscription>();
    subscriptions.forEach(name => {
      speechSubs.set(name, this.mmir.dialog._eventEmitter[name].subscribe(function() {
        //DEBUG
        // let args = arguments.length === 1? arguments[0] : (arguments.length? arguments.length : void(0));
        // console.log(name +' -> ', args);
        if(handler[name]){
          handler[name].apply(handler, arguments);
        } else {
          console.warn('No function "'+name+'" in View available!');
        }
      }));
    });
    return speechSubs;
  }

  public unsubscribe(speechEventSubscriptions: Map<SpeechEventName, Subscription>): void {
    speechEventSubscriptions.forEach((subscription) => {
      if(subscription && !subscription.closed){
        subscription.unsubscribe();
      }
    });
  }

}
