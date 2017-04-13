
import { Component, Input, OnInit, OnDestroy, OnChanges, ViewChild } from '@angular/core';

import { MmirProvider } from './../../providers/mmir';

import { MmirModule } from './../../models/MmirInterfaces';
import { SpeechFeedbackOptions, ISpeechFeedback } from './../../models/ISpeechInput';

//TODO impl. interface ISpeechFeedback instead of OnInit/OnDestroy

@Component({
    selector: 'fab-miclevels',
    templateUrl: 'fab-miclevels.html'
})
export class FabMiclevels implements OnInit, OnDestroy, OnChanges, ISpeechFeedback {

    @ViewChild('micCanvas') canvas;

    private static isNuanceSpeech: boolean = false;//TODO does this need to be dynamically re-evaluated on change-detection?
    private static isCordova: boolean = false;

    private _isInit: boolean = false;
    private _isDestroyed: boolean = false;

    private handleMicLevelChange: Function;

    private _mmir: MmirModule;
    private ctx;
    private targetRad: number;//"offset" radius for mic-level 0 (circle that will be renderen for mic-level 0)
    // private levels: number;//count of mic-level steps for rendering values from [min-mic-level, max-mic-level]

    /**
     * render "- offset" different levels;
     * (a value > 0 would show a "base activation" as soon as "active === true")
     */
    public offset = 3;

    @Input() width: number;
    @Input() height: number;
    @Input() levels: number;
    @Input() target: any;
    @Input() active: boolean;

    constructor(
        private mmirProvider: MmirProvider
    ) {

        this._mmir = mmirProvider.mmir;
        this.width = 0;
        this.height = 0;
        this.levels = 0;

        // this.isCordova = false;
        // this.isNuanceSpeech = false;
    }

    private static createMicLevelChangeHandler(fabMic: FabMiclevels): Function {

        return function(micLevel: number, rms: number) {

            let cvs = fabMic.canvas.nativeElement;
            if(cvs.clientHeight === 0 || cvs.clientWidth === 0){//FIXME is there a better way to determine visibility?
              return;
            }

            if (micLevel === 0) {
                fabMic.repaint(0);
                return; ///////////////////// EARLY EXIT //////////////
            }

            //convert to positive values, if necessary (we are only interested in the absolute values)
            if (micLevel < 0) {
                micLevel = -micLevel;
            }

            var max = 90;
            if (FabMiclevels.isCordova) {

                //unfortunately we have to do some normalization for the various Speech plugins...

                //normalize very small values to zero
                if (micLevel < 1) {
                    micLevel = 0;
                } else {
                    if (FabMiclevels.isNuanceSpeech) {
                        max -= 20;
                        micLevel -= 20;
                    }
                }
            } else {
                //for non-Cordova env: use & increase RMS value (so that it will be similar to Cordova env values)
                micLevel = 3.5 * rms;
            }


            let scale;
            if (FabMiclevels.isNuanceSpeech) {
                scale = max / fabMic.levels;
            } else {
                scale = max / (fabMic.levels - fabMic.offset);
            }

            //TODO log-scale values?

            //map float-value [0, 90] to integer [0, self.levels]
            let val = Math.floor(micLevel / scale);

            // console.log('mic-paint['+rms+']: ('+micLevel+' / '+scale+') -> '+val);

            //cut off val > self.levels
            if (!FabMiclevels.isNuanceSpeech) {
                val = Math.min(val + fabMic.offset, fabMic.levels);
            } else {
                val = Math.min(val, fabMic.levels);
            }

            fabMic.repaint(val);
        };
    }

    repaint(value: number) {

        if (this._isDestroyed) {
            return;
        }

        const minLevelRad = this.targetRad;
        const centerx = this.width / 2;
        const centery = this.height / 2;

        // console.log('mic-paint: '+value+' (+ '+minLevelRad+') / '+this.levels);

        this.ctx.save()
        this.ctx.fillStyle = "rgba(200,200,200, 0.7)"
        this.ctx.clearRect(0, 0, centerx * 2, centery * 2);
        this.ctx.beginPath();
        this.ctx.arc(centerx, centery, minLevelRad + value, 0, 2 * Math.PI);
        this.ctx.fill()
        this.ctx.restore()
    }

    ngOnInit() {

        let canvas = this.canvas.nativeElement;
        this.ctx = canvas.getContext('2d');

        //get height/width from target-element
        let targetEl: HTMLElement;
        if (typeof this.target === 'string') {
            targetEl = document.getElementById(this.target);
        }  else if(this.target && this.target.getNativeElement){
            targetEl = this.target.getNativeElement();
        } else {
            targetEl = this.target;
        }

        if (!targetEl) {

            //TODO try to find a FAB button and use it as targetEl
            //ASSERT canvas has at least 2 parents: 1st parent is <fab-miclevels> wrapper, 2nd is at least the document
            let container = canvas.parentElement.parentElement;
            let els = container.getElementsByTagName('button');
            for (let i = els.length - 1; i >= 0; --i) {
                if (els[i].classList.contains('fab')) {
                    //-> use first found FAB button as targetEl
                    targetEl = els[i];
                    break;
                }
            }

            if (!targetEl) {
                //fallback: use default size for FAB buttons
                targetEl = {
                    clientWidth: 56,
                    clientHeight: 56,
                } as HTMLElement;
            }
        }

        if (!this.levels && (!this.width || !this.height)) {

            if (!this.width) {
                let levels: number;
                if (this.height) {
                    levels = Math.max(0, this.height - targetEl.clientHeight);
                }
                this.width = targetEl.clientWidth + (levels ? levels : 10) * 2;
            }

            if (!this.height) {
                let levels: number;
                if (this.width) {
                    levels = Math.max(0, this.width - targetEl.clientWidth);
                }
                this.height = targetEl.clientHeight + (levels ? levels : 10) * 2;
            }

        } else {

            if (!this.width) {
                this.width = targetEl.clientWidth + this.levels * 2;
            }

            if (!this.height) {
                this.height = targetEl.clientHeight + this.levels * 2;
            }
        }

        //set "offset" for rendering circle to minimal target side
        //  (i.e. stay invisible when rendering mic-level 0)
        let targetLen = Math.min(targetEl.clientWidth, targetEl.clientHeight);
        this.targetRad = targetLen / 2;

        //center the canvas in relation to target-element
        // (NOTE: if the canvas is smaller than target, no mic-levels will get rendered visibly)
        let offsetLeft = Math.max(0, this.width - targetEl.clientWidth) / 2;
        let offsetTop = Math.max(0, this.width - targetEl.clientHeight) / 2;

        //range for visualizing [min-mic-level, max-mic-level]
        this.levels = Math.min(offsetLeft, offsetTop);

        let style = [
            'left: -', offsetLeft, 'px;',
            'top: -', offsetTop, 'px;',
            'position: absolute;',
        ].join('');

        canvas.style.cssText = style;


        if(!this.handleMicLevelChange){

          this.handleMicLevelChange = FabMiclevels.createMicLevelChangeHandler(this);

          this._mmir.ready(() => {

              if (this._isDestroyed) {
                  return;///////////// EARLY EXIT //////////////
              }

              // console.log('registering mic-level-change handler...');//DEBUG

              FabMiclevels.isCordova = this._mmir.require('env').isCordovaEnv;
              FabMiclevels.isNuanceSpeech = false;

              if (FabMiclevels.isCordova) {
                  let cordovaSpeechModules = this._mmir.ConfigurationManager.get('mediaManager.plugins.cordova', true, null);
                  if (cordovaSpeechModules) {
                      for (var i = cordovaSpeechModules.length - 1; i <= 0; --i) {
                          if (/nuanceAudioInput\.js/i.test(cordovaSpeechModules[i])) {
                              //FIXME technically this only checks, if a configuration for the nuance-plugin is present (not if it currently used/active)
                              FabMiclevels.isNuanceSpeech = true;
                              break;
                          }
                      }
                  }
              }

              this._mmir.MediaManager.on('miclevelchanged', this.handleMicLevelChange);

          });
        }

        this._isInit = true;
    }

    ngOnDestroy() {

        this._isDestroyed = true;

        if (this._isInit) {

          this._mmir.MediaManager.off('miclevelchanged', this.handleMicLevelChange)
          this.handleMicLevelChange = null;
        }
    }

    ngOnChanges(changes) {
        if (this._isInit && changes && changes.active) {
            if (!changes.active.currentValue) {
                // console.log('mic-paint: deactivated mic!');
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
