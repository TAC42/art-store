import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/shop';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})
export class ProductPreviewComponent {
  @Input() product!: Product
  @Output() remove = new EventEmitter()
  prodImg: string = '';

  constructor(private http: HttpClient) {
    this.fetchRandomRobotImage();
  }

  fetchRandomRobotImage() {
    this.http.get<any>('https://robohash.org/').subscribe(
      (data) => {
        // Data will contain a random robot image URL
        this.prodImg = data?.imageUrl || 'default_image_url_if_not_available';
      },
      (error) => {
        console.error('Error fetching robot image:', error);
        // Set a default image URL in case of an error
        this.prodImg = 'default_image_url';
      }
    );
  }
  onRemoveProduct() {
    this.remove.emit(this.product._id)
  }
}
