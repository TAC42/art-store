import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { UploadService } from '../../services/upload.service'
import { EventBusService, showErrorMsg } from '../../services/event-bus.service'

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html'
})

export class ImageUploaderComponent {
  @Input() index: number = 0
  @Input() defaultImgUrl: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'
  @Input() productType: string = ''
  @Output() onUploaded = new EventEmitter<{ url: string, index: number }>()

  private eBusService = inject(EventBusService)
  private upService = inject(UploadService)

  imgUrl: string = ''
  isUploading: boolean = false
  inputId: string = ''

  ngOnChanges(): void {
    this.imgUrl = this.defaultImgUrl
    console.log("imgUrl set to:", this.imgUrl)
    this.inputId = `imgUpload-${this.index}`
  }

  // Check if image is either too heavy or wrong format
  validateFile(file: File): { isValid: boolean, errorHeader?: string, errorMessage?: string } {
    const fileSize = file.size / 1024 / 1024
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png']

    if (fileSize > 2) return {
      isValid: false,
      errorHeader: 'Too Big!',
      errorMessage: 'File size exceeds 2 MB!'
    }

    if (!allowedFormats.includes(file.type)) return {
      isValid: false,
      errorHeader: 'Invalid format!',
      errorMessage: 'Only JPG, JPEG, and PNG are allowed!'
    }
    return { isValid: true }
  }

  async uploadImg(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement
    if (!fileInput.files?.length) return

    const file = fileInput.files[0]
    const validation = this.validateFile(file)

    if (!validation.isValid) {
      showErrorMsg(validation.errorHeader!, validation.errorMessage!, this.eBusService)
      return
    }

    this.isUploading = true
    try {
      const data = await this.upService.uploadImg(file, this.productType)
      this.imgUrl = data.secure_url
      this.onUploaded.emit({ url: this.imgUrl, index: this.index })
    } catch (error) {
      console.error('Upload failed', error)
      showErrorMsg('Upload Failed!', 'Sorry! Try to upload the image again...', this.eBusService)
    } finally {
      this.isUploading = false
    }
  }

  getUploadLabel(): string {
    if (this.imgUrl) return 'Replace Image?'
    return this.isUploading ? 'Uploading....' : 'Upload Image'
  }
}