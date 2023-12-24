import { OutsideClickDirective } from "./outside-click.directive"
import { ElementRef } from "@angular/core"

describe('OutsideClickDirective', () => {
  it('should create an instance', () => {
    const elementRefMock: ElementRef = new ElementRef(document.createElement('div'))

    const directive = new OutsideClickDirective(elementRefMock)
    expect(directive).toBeTruthy()
  })
})