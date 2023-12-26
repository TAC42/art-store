import { Directive, ElementRef, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core'

@Directive({
  selector: '[appOutsideClick]'
})

export class OutsideClickDirective implements OnInit, OnDestroy {
  @Output() outsideClick = new EventEmitter<void>()

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside = (event: MouseEvent): void => {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.outsideClick.emit()
    }
  }
}
