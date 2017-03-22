
import { Component, Input, OnInit, OnDestroy, OnChanges, ViewChild } from '@angular/core';

import { MmirProvider } from './../../providers/mmir';

import { MmirModule } from './../../models/MmirInterfaces';
import { SpeechFeedbackOptions, ISpeechFeedback } from './../../models/ISpeechInput';

const OFFSET = 3;//render 10 different levels;
const LEVELS = 20;//render 20 different levels;

//TODO impl. interface ISpeechFeedback instead of OnInit/OnDestroy

@Component({
  selector: 'fab-miclevels',
  templateUrl: 'fab-miclevels.html'
})
export class FabMiclevels implements OnInit, OnDestroy, OnChanges, ISpeechFeedback {

  @ViewChild('micCanvas') canvas;

  private _isInit: boolean = false;
  private _isDestroyed: boolean = false;

  private _mmir: MmirModule;
  private isNuanceSpeech: boolean;
  private isCordova: boolean;
  private handleMicLevelChange: Function;
  private ctx;

  @Input() width: number;
  @Input() height: number;
  @Input() active: boolean;

  constructor(
    private mmirProvider: MmirProvider
  ) {

    this._mmir = mmirProvider.mmir;
    this.width = 76;
    this.height = 76;

    this.isCordova = false;
   	this.isNuanceSpeech = false;
  }

  createMicLevelChangeHandler(){

    var self = this;
    return function(micLevel: number){

      if(micLevel === 0){
        self.repaint(0);
        return; ///////////////////// EARLY EXIT //////////////
      }

      var max = 90;
      if(self.isCordova){

        //unfortunately we have to do some normalization for the various Speech plugins...

        //convert to positive values, if necessary (we are only interested in the absolute values)
        if(micLevel < 0){
          micLevel = -micLevel;
        }

        //normalize very small values to zero
        if(micLevel < 1){
          micLevel = 0;
        } else{
          if(self.isNuanceSpeech){
            max -= 20;
            micLevel -= 20;
          }
        }
      }


      let scale;
      if(self.isNuanceSpeech){
        scale = max/LEVELS;
      } else {
        scale = max/(LEVELS-OFFSET);
      }

      //TODO log-scale values

      //map float-value [0, 90] to integer [0, LEVELS]
      let val = Math.floor(micLevel / scale);

      //cut off val > LEVELS
      if(!self.isNuanceSpeech){
        val = Math.min(val + OFFSET, LEVELS);
      } else {
        val = Math.min(val, LEVELS);
      }

      self.repaint(val);
    };
  }

  repaint(value: number){

    if(this._isDestroyed){
      return;
    }

    console.log('mic-paint: '+value);

    const minLevelRad = 28;//TODO calc from fab btn
    const centerx = this.width/2;//38;//TODO calc from fab btn & canvas size
    const centery = this.height/2;//38;//TODO calc from fab btn & canvas size

    this.ctx.save()
    this.ctx.fillStyle = "rgba(200,200,200, 0.7)"
    this.ctx.clearRect(0, 0, centerx*2, centery*2);
    this.ctx.beginPath();
    //this.ctx.arc(38, 38, 28, 0, 2 * Math.PI);// level min
    //this.ctx.arc(38, 38, 38, 0, 2 * Math.PI);// level max
    this.ctx.arc(centerx, centery, minLevelRad + value, 0, 2 * Math.PI);// level min
    this.ctx.fill()
    this.ctx.restore()
  }

  ngOnInit(){

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.handleMicLevelChange = this.createMicLevelChangeHandler();

    this._mmir.ready(()=>{

      if(this._isDestroyed){
        return;///////////// EARLY EXIT //////////////
      }

      console.log('registering mic-level-change handler...');//DEBUG

      this.isCordova = this._mmir.require('env').isCordovaEnv;
     	this.isNuanceSpeech = false;

     	if(this.isCordova){
        let cordovaSpeechModules = this._mmir.ConfigurationManager.get('mediaManager.plugins.cordova', true, null);
        if(cordovaSpeechModules){
       		for(var i=cordovaSpeechModules.length-1; i <= 0; --i){
       			if(/nuanceAudioInput\.js/i.test(cordovaSpeechModules[i])){
       				this.isNuanceSpeech = true;
       				break;
       			}
       		}
       	}
      }

      this._mmir.MediaManager.on('miclevelchanged', this.handleMicLevelChange);
    });

    this._isInit = true;
  }

  ngOnDestroy(){
    this._isDestroyed = true;
    if(this._isInit){
      this._mmir.MediaManager.off('miclevelchanged', this.handleMicLevelChange)
      this.handleMicLevelChange = null;
    }
  }

  ngOnChanges(changes){
    if(this._isInit && changes && changes.active){
      if(!changes.active.currentValue){
        console.log('mic-paint: deactivated mic!');
        this.repaint(0);
      }
    }
  }


  /**
   * Called when GUI should show indicator for Microphone input levels.
   *
   * This should also initialize/start listening to mic-levels changes, e.g.
   * register a listener:
   * <pre>
   * mmir.MediaManager.on('miclevelchanged', miclevelsChandeHandler);
   * </pre>
   * where miclevelsChandeHandler:
   *    function(micLevel: number)
   *
   * @param {ShowSpeechStateOptions} options
   *              the data specifying the (changed) speech input state etc.
   */
  startMicLevels(options: SpeechFeedbackOptions): void {
    //TODO ... handled direcly by fab-miclevels component ... should this be extracted to separate interaface definition?
  }

  /**
   * Called when GUI should hide/deactivate indicator for Microphone input levels.
   *
   * This should destroy/free resource that were set up for visualizing mic-level
   * changes, e.g. could stop listening to mic-level changes, i.e. unregister listener:
   * <pre>
   * mmir.MediaManager.off('miclevelchanged', miclevelsChandeHandler);
   * </pre>
   *
   * @param {ShowSpeechStateOptions} options
   *              the data specifying the (changed) speech input state etc.
   */
  stopMicLevels(options: SpeechFeedbackOptions): void {
    //TODO ... handled direcly by fab-miclevels component ... should this be extracted to separate interaface definition?
  }

}
