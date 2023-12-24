import { Component, ElementRef, HostListener } from '@angular/core'

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html'
})

export class AsideMenuComponent {
  isMenuOpen: boolean = false

  constructor(private elementRef: ElementRef) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu() {
    this.isMenuOpen = false
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target)

    if (!clickedInside) this.isMenuOpen = false
  }
}