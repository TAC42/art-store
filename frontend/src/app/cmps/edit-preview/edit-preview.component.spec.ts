import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditPreviewComponent } from './edit-preview.component'

describe('EditPreviewComponent', () => {
  let component: EditPreviewComponent
  let fixture: ComponentFixture<EditPreviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPreviewComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(EditPreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
