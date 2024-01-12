import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollPositions: { [url: string]: number } = {}

  getScrollPosition(url: string): number {
    return this.scrollPositions[url] || 0
  }

  setScrollPosition(url: string, position: number): void {
    this.scrollPositions[url] = position
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}
