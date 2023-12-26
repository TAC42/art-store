import { TestBed } from '@angular/core/testing'
import { SvgRenderService } from './svg-render.service'

describe('SvgRenderService', () => {
  let service: SvgRenderService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SvgRenderService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  })
})
