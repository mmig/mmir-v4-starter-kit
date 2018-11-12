
import { SpeechEventSubscription } from '../io/ISpeechIO';
import { IonicMmirModule } from '../mmir-provider';

export class SubscriptionUtil {

  constructor(private mmir: IonicMmirModule){}

  public subscribe(speechEventSubscriptions: SpeechEventSubscription, handler: any): void {
    const keys = Object.keys(speechEventSubscriptions);
    keys.forEach(name => {
      speechEventSubscriptions[name] = this.mmir.dialog._eventEmitter[name].subscribe(function() {
        //DEBUG
        // let args = arguments.length === 1? arguments[0] : (arguments.length? arguments.length : void(0));
        // console.log(name +' -> ', args);
        if(handler[name]){
          handler[name].apply(handler, arguments);
        } else {
          console.warn('No function "'+name+'" in View available!');
        }
      });
    });
  }

  public unsubscribe(speechEventSubscriptions: SpeechEventSubscription): void {
    const keys = Object.keys(speechEventSubscriptions);
    let subname: string;
    for(let i = keys.length - 1; i >= 0; --i){
      subname = keys[i];
      if(speechEventSubscriptions[subname]){
        speechEventSubscriptions[subname].unsubscribe();
      }
    }
  }

}
