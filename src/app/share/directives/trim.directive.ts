import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTrim]'
})
export class TrimDirective {

  constructor(private _er:ElementRef) { }

  @HostListener('change')
  update(){
    let ele = this._er.nativeElement as HTMLInputElement;
    if (typeof ele.value === 'string') {
        ele.value = ele.value.trim();
    }
  }

}
