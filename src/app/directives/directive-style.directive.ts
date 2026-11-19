import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDirectiveStyle]', 
  standalone: true
})
export class DirectiveStyleDirective{


  constructor(private el: ElementRef) {
    el.nativeElement.style.color ='green';
   }
}
