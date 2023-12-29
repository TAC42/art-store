import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  loaderService = inject(LoaderService)
  isLoading$ = this.loaderService.isLoading$
}
