import { Component, Input } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent {
  @Input() deviceType$!: Observable<string>
}
