import { Component, Input } from '@angular/core'

@Component({
  selector: 'edit-preview',
  templateUrl: './edit-preview.component.html'
})

export class EditPreviewComponent {
  @Input() name: string = ''
  @Input() imgUrl: string = ''
  @Input() price: string = ''
  @Input() description: string = ''
  @Input() materials: string = ''
  @Input() dimensions: string = ''
}
