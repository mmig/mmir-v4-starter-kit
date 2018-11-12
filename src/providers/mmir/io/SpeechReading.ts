
import { ElementRef } from '@angular/core';
import { getHtmlElement } from '../util/Utils';
import { READ_CONTROL } from './ISpeechIO';

export class ReadTargetHandler {

  public activeHandler: ReadHandler;

  private targets: Map<string, ReadHandler>;

  constructor(){
    this.targets = new Map<string, ReadHandler>()
  }

  public get(id: string): ReadHandler {
    return this.targets.get(id);
  }

  tryGetAndPut(targetId: string | ElementRef | HTMLElement, event?: Event): ReadHandler {

    let handler: ReadHandler;
    if(typeof targetId === 'string'){
      handler = this.get(targetId);
    }

    if(!handler){
      let elem: HTMLElement = getHtmlElement(targetId, event);
      if(elem){
        if(typeof targetId !== 'string'){
          targetId = elem.id;
        }
        handler = new ReadHandler(targetId, elem);
        this.put(handler.id, handler);
      }
    }

    return handler;
  }

  public has(id: string): boolean {
    return this.targets.has(id);
  }

  public put(id: string, el: ReadHandler): void {
    this.targets.set(id, el);
  }

  public reset(){
    if(this.targets.size > 0){
      this.targets.forEach(handler => handler.destroy());
      this.targets.clear();
    }
    this.activeHandler = null;
  }

  public apply(func: (handler: ReadHandler) => void){
    if(this.targets.size > 0){
      this.targets.forEach(func);
    }
  }

  public destroy() {
    if(this.activeHandler){
      const handler = this.activeHandler;
      this.activeHandler = null;
      this.targets.delete(handler.id);
      handler.destroy();
    }
    this.reset();
  }
}

export class ReadHandler {

  public error: string;
  constructor(public id: string, public ctrl: HTMLElement){

    this.ctrl.classList.add(READ_CONTROL);
  }

  public destroy(){
    this.ctrl = null;
  }
}
