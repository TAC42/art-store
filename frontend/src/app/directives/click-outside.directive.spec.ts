import { ClickOutsideDirective } from "./click-outside.directive"
import { ElementRef } from "@angular/core"

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const elementRefMock: ElementRef = new ElementRef(document.createElement('div'))

    const directive = new ClickOutsideDirective(elementRefMock)
    expect(directive).toBeTruthy()
  })
})