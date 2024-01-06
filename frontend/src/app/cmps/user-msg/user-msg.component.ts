import { Component, OnDestroy, OnInit } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { EventBusService } from '../../services/event-bus.service'

@Component({
  selector: 'app-user-msg',
  templateUrl: './user-msg.component.html',
  animations: [
    trigger('messageAnimation', [
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(3em)'
      })),
      transition('hidden => visible', animate('1s ease-out')),
      transition('visible => hidden', animate('1s ease-in'))
    ])
  ]
})

export class UserMsgComponent implements OnInit, OnDestroy {
  successIcon: string = 'successIcon'
  errorIcon: string = 'errorIcon'

  msgState: string = 'hidden'
  isVisible: boolean = false
  msg: { title: string; txt: string; type: string } | null = null

  private unsubscribe: () => void = () => { }
  constructor(private eBusService: EventBusService) { }

  ngOnInit(): void {
    this.unsubscribe = this.eBusService.on('show-user-msg', (newMsg) => {
      this.msg = newMsg
      this.isVisible = true

      setTimeout(() => {
        this.msgState = 'visible'
      }, 1)

      setTimeout(() => {
        this.msgState = 'hidden'
        setTimeout(() => {
          this.isVisible = false
          this.msg = null
        }, 1000)
      }, 6000)
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }
}