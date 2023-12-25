import { Component, ElementRef, HostListener } from '@angular/core'
import { trigger, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})

export class AsideMenuComponent {
  isMenuOpen: boolean = false
  ocLogo: string = 'ocLogo'

  constructor(private elementRef: ElementRef) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  get menuState() {
    return this.isMenuOpen ? 'in' : 'out'
  }

  closeMenu() {
    this.isMenuOpen = false
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) this.closeMenu()
  }
}