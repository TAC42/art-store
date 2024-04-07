import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class EventBusService {
  private listenersMap: { [eventName: string]: ListenerFunction[] } = {}

  on(eventName: string, listener: ListenerFunction): () => void {
    this.listenersMap[eventName] = this.listenersMap[eventName] ?
      [...this.listenersMap[eventName], listener] : [listener]
    return () => {
      this.listenersMap[eventName] = this.listenersMap[
        eventName].filter(func => func !== listener)
    }
  }

  emit(eventName: string, data: any): void {
    if (!this.listenersMap[eventName]) return
    this.listenersMap[eventName].forEach(listener => listener(data))
  }
}

type ListenerFunction = (data: any) => void

export function showUserMsg(msg: { title: string; txt: string; type: string },
  eBusService: EventBusService) {
  eBusService.emit('show-user-msg', msg)
}

export function showSuccessMsg(title: string, txt: string,
  eBusService: EventBusService) {
  showUserMsg({ title, txt, type: 'success' }, eBusService)
}

export function showErrorMsg(title: string, txt: string,
  eBusService: EventBusService) {
  showUserMsg({ title, txt, type: 'error' }, eBusService)
}