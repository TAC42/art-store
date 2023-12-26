import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { SvgRenderService } from '../../services/svg-render.service'

@Component({
  selector: 'svg-render',
  templateUrl: './svg-render-component.html'
})
export class SvgRenderComponent implements OnInit {
  svgContent: SafeHtml = ''
  @Input() svgName: string = ''

  constructor(private svgRenderService: SvgRenderService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const rawSvg = this.svgRenderService.getSvg(this.svgName)
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(rawSvg)
  }
}
