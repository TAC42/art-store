import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { UploadService } from '../../services/media/upload.service'
import { EventBusService, showErrorMsg } from '../../services/utils/event-bus.service'

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html'
})

export class ImageUploaderComponent {
  @Input() index: number = 0
  @Input() defaultImgUrl: string = ''
  @Input() folderName: string = ''
  @Output() onUploaded = new EventEmitter<{ url: string, index: number }>()

  private eBusService = inject(EventBusService)
  private upService = inject(UploadService)

  imgUrl: string = ''
  isUploading: boolean = false
  inputId: string = ''

  ngOnChanges(): void {
    this.imgUrl = this.defaultImgUrl
    this.inputId = `imgUpload-${this.index}`
  }

  // Check if image is either too heavy or wrong format
  validateFile(file: File): { isValid: boolean, errorHeader?: string, errorMessage?: string } {
    const fileSize = file.size / 1024 / 1024
    const allowedFormats = ['image/avif']

    if (fileSize > 2) return {
      isValid: false,
      errorHeader: 'Too Big!',
      errorMessage: 'File size exceeds 2 MB!'
    }

    if (!allowedFormats.includes(file.type)) return {
      isValid: false,
      errorHeader: 'Invalid format!',
      errorMessage: 'Only AVIF is allowed!'
    }
    return { isValid: true }
  }

  // When the user decides to drag & drop
  onFileDropped(file: File) {
    this.uploadFile(file)
  }

  async uploadFile(file: File): Promise<void> {
    const validation = this.validateFile(file)
    if (!validation.isValid) {
      showErrorMsg(validation.errorHeader!, validation.errorMessage!, this.eBusService)
      return
    }
    this.isUploading = true

    try {
      const data = await this.upService.uploadImg(file, this.folderName)
      this.imgUrl = data.secure_url
      this.onUploaded.emit({ url: this.imgUrl, index: this.index })
    } catch (error) {
      console.error('Upload failed', error)
      showErrorMsg('Upload Failed!', 'Sorry! Try to upload the image again...', this.eBusService)
    } finally {
      this.isUploading = false
    }
  }

  onFileInputChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement
    if (fileInput.files && fileInput.files.length > 0) {
      this.uploadFile(fileInput.files[0])
    }
  }

  getUploadLabel(): string {
    if (this.imgUrl) return 'Replace Image?'
    return this.isUploading ? 'Uploading....' : 'Upload Image'
  }
}