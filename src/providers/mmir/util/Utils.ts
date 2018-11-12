
import { ElementRef } from '@angular/core';

/**
 * HELPER get/extract a "target" element
 *
 * @param  {string | ElementRef | HTMLElement | null} targetId
 *           an ID attribute, reference or HTML element
 * @param  {Event} [event]
 *          if targetId is omitted, and the event is specified, the currentTarget (or target) of
 *          the event are used
 * @return {HTMLElement} the HTML element (or null)
 */
export function getHtmlElement(targetId: string | ElementRef | HTMLElement, event?: Event): HTMLElement {
  let elem: HTMLElement = null;
  if(targetId){
    if(typeof targetId === 'string'){
      elem = document.getElementById(targetId);
    } else if((targetId as ElementRef).nativeElement){
      elem = (targetId as ElementRef).nativeElement;
    } else {
      elem = targetId as HTMLElement;
    }
  }

  if(!elem && event){
    elem = (event.currentTarget || event.target) as HTMLElement;
  }

  return elem;
}
