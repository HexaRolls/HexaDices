import { IpcChannelInterface, IpcRequest } from '../IpcChannelInterface'
import { IpcMainEvent } from 'electron'
import { Main } from '../../index'

export default class HostSearch implements IpcChannelInterface {
  getName() {
    return 'host:search'
  }

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void {
    main.bonjour.find({
      type: 'HDSS'
    }, function (service: any) {
      event.sender.send('host:found', service)
    })
  }
}
