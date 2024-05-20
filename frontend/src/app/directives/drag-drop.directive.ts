import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core'

@Directive({
  selector: '[dragDrop]'
})

export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<File>()

  private el = inject(ElementRef)

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.el.nativeElement.classList.add('drag-over')
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.el.nativeElement.classList.remove('drag-over')
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.el.nativeElement.classList.remove('drag-over')

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.fileDropped.emit(files[0])
    }
  }
}