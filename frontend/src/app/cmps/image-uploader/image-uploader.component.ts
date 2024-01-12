import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { UploadService } from '../../services/upload.service'

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html'
})

export class ImageUploaderComponent {
  @Input() index: number = 0
  @Input() defaultImgUrl: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'
  @Input() productType: string = ''
  @Output() onUploaded = new EventEmitter<{ url: string, index: number }>()

  public uService = inject(UploadService)

  imgUrl: string = ''
  isUploading: boolean = false
  inputId: string = ''

  ngOnChanges(): void {
    this.imgUrl = this.defaultImgUrl
    console.log("imgUrl set to:", this.imgUrl)
    this.inputId = `imgUpload-${this.index}`
  }

  async uploadImg(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement
    if (!fileInput.files?.length) return

    this.isUploading = true
    try {
      const data = await this.uService.uploadImg(fileInput.files[0], this.productType)
      this.imgUrl = data.secure_url
      this.onUploaded.emit({ url: this.imgUrl, index: this.index })
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      this.isUploading = false
    }
  }

  getUploadLabel(): string {
    if (this.imgUrl) return 'Replace Image?'
    return this.isUploading ? 'Uploading....' : 'Upload Image'
  }
}