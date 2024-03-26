import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  private readonly CLOUD_NAME = "dv4a9gwn4"
  private readonly UPLOAD_PRESET = "kgcvd0si"
  private readonly UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`

  async uploadImg(file: File, folderName: string): Promise<any> {
    try {
      const folderPath = folderName
      const formData = new FormData()
      formData.append('upload_preset', this.UPLOAD_PRESET)
      formData.append('file', file)
      formData.append('folder', folderPath)

      const response = await fetch(this.UPLOAD_URL, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      return data
    } catch (err) {
      console.error('Failed to upload', err)
      throw err
    }
  }
}
