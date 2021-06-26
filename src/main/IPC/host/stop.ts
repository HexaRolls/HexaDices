import { IpcChannelInterface, IpcRequest } from '../IpcChannelInterface'
import { IpcMainEvent } from 'electron'
import { Main } from '../../index'

export default class HostStop implements IpcChannelInterface {
  getName() {
    return 'host:stop'
  }

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void {
    main.bonjour.unpublishAll(() => {
      event.sender.send('host:stopped')
    })
  }
}
