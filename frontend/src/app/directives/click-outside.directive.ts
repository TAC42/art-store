import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core'

@Directive({
  selector: '[clickOutside]'
})

export class ClickOutsideDirective {

  constructor(private el: ElementRef) { }

  @Output() clickOutside = new EventEmitter()

  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    const isClickedInside = this.el.nativeElement.contains(ev.target)
    if (!isClickedInside) this.clickOutside.emit()
  }
}
