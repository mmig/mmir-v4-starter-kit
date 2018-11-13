
export interface ISpeechInputIndicator {

  initialized: boolean;

  show(event, target?: HTMLElement): void;
  toggle(event, target?: HTMLElement): void;
  hide(): void;
  ready(overlayTarget?: OverlayTarget) : Promise<void>;
}

export interface ISpeechOutputIndicator {

  initialized: boolean;

  startReading(e, target?: HTMLElement): void;
  stopReading(isLeaveOpen?: boolean): void;

  ready(overlayTarget?: OverlayTarget) : Promise<void>;
}

export interface OverlayTarget {
    target: HTMLElement;
    show: boolean;
}
