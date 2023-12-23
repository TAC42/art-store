import { Component, Input, OnInit } from '@angular/core';
import { SvgRenderService } from '../../services/svg-render.service';

@Component({
  selector: 'svg-render',
  templateUrl: './svg-render-component.html'
})
export class SvgRenderComponent implements OnInit {
  svgContent: string = '';
  @Input() svgName: string = '';

  constructor(private svgRenderService: SvgRenderService) { }

  // ngOnChanges() {
  //   if (this.svgName) {
  //     this.displaySvg(this.svgName);
  //   }
  // }

  ngOnInit() {
    console.log('Hello from oninit svgrender', this.svgName);

    if (this.svgName) {

      this.displaySvg(this.svgName)
    }
  }

  displaySvg(name: string): void {
    this.svgContent = this.svgRenderService.getSvg(name);
    // console.log('svgContent', this.svgContent);

  }
}
