
import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { VoiceUIProvider } from '../../providers/mmir';
import { MmirProvider } from '../../providers/mmir/mmir-provider';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'speech-cmd-btn',
  templateUrl: 'speech-cmd-btn.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeechCmdBtnComponent implements OnInit, OnDestroy {

  @Input() public btnId: string = 'speech-cmd-btn';

  public asrActive: Observable<boolean>;

  constructor(
    private mmir: MmirProvider<any>,
    private vui: VoiceUIProvider<any>,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.mmir.ready().then(() => {

      this.asrActive = this.mmir.mmir.dialog._eventEmitter.showSpeechInputState.map(status => {
        setTimeout(() =>  this.changeRef && this.changeRef.detectChanges(), 0);//HACK: need to force re-evalution?!? ... otherwise the privious state will be shown
        return status.state;
      });

    });
  }

  ngOnDestroy() {
    this.changeRef = null;
  }

  public speechCommandClicked(event: MouseEvent): void {
    this.vui.ctrl.commandClicked(event, this.btnId);
  }
}
