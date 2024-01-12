import { Component, Input, OnInit, inject } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { SvgRenderService } from '../../services/svg-render.service'

@Component({
  selector: 'svg-render',
  templateUrl: './svg-render-component.html'
})
export class SvgRenderComponent implements OnInit {
  private svgRenderService = inject(SvgRenderService)
  private sanitizer = inject(DomSanitizer)
  
  svgContent: SafeHtml = ''
  @Input() svgName: string = ''

  ngOnInit() {
    const rawSvg = this.svgRenderService.getSvg(this.svgName)
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(rawSvg)
  }
}
