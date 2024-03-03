import { Directive, ElementRef, OnInit } from '@angular/core'

@Directive({
  selector: '[autofocus]'
})

export class AutofocusDirective implements OnInit {
  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    // Attempt to focus the element immediately and after a brief delay
    this.focus()
    setTimeout(() => this.focus(), 100)
  }

  private focus() {
    this.el.nativeElement.focus()
  }
}
