
declare var mmir;//FIXME

export var IS_SOUND_FEEDBACK  = true;
export var IS_HAPTIC_FEEDBACK = true;
//default time-duration for click-feedback vibration
export var CLICK_VIBRATE_DURATION = 50;//ms

export type FeedbackOption = {sound?: boolean, haptic?: boolean};

export function isSoundFeedbackEnabled() {
  var isSound = mmir.conf.get('soundFeedbackEnabled');
  if(typeof isSound === 'undefined'){
    isSound = IS_SOUND_FEEDBACK;
  }
  return isSound;
}

export function isHapticFeedbackEnabled() {
  var isHaptic = mmir.conf.get('hapticFeedbackEnabled');
  if(typeof isHaptic === 'undefined'){
    isHaptic = IS_HAPTIC_FEEDBACK;
  }
  return isHaptic;
}
/**
 *
 * @param config (optional) cofiguration object with fields
 * 			config.audio BOOLEAN set if sound should be included in this feedback
 * 			config.haptic BOOLEAN set if vibration should be included in this feedback
 */
export function triggerClickFeedback(config?: FeedbackOption){

  var isSound  = config && typeof config.sound  !== 'undefined'? config.sound  : true;
  var isHaptic = config && typeof config.haptic !== 'undefined'? config.haptic : true;


  //TODO haptic and sound feedback should be run in parallel, not sequential (... use 'threads'?)
  if(isHaptic && isHapticFeedbackEnabled()){
    triggerHapticFeedback();
  }

  if(isSound && isSoundFeedbackEnabled()){
    triggerSoundFeedback();
  }
}

export function triggerHapticFeedback(){
  setTimeout(function(){
      mmir.notifier.vibrate(CLICK_VIBRATE_DURATION);
  },0);
}

export function triggerSoundFeedback(){
  //do not block function, return immediatly using setTimeout
  setTimeout(function(){
      mmir.notifier.beep(1);
  },0);
}

export function triggerErrorFeedback(){
  triggerMulitpleVibrationFeedback(3);
}

export function triggerMulitpleVibrationFeedback(number: number){

  var doTriggerErrorVibrateFeedback = function(){
    setTimeout(function(){
      triggerClickFeedback();
      ++count;
      if(count < number){
        doTriggerErrorVibrateFeedback();
      }
    }, 4 * CLICK_VIBRATE_DURATION);
  };

  triggerClickFeedback();
  var count = 1;
  if(count < number){
    doTriggerErrorVibrateFeedback();
  }
}
