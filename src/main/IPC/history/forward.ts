import { IpcChannelInterface, IpcRequest } from '../IpcChannelInterface'
import { IpcMainEvent } from 'electron'
import { Main } from '../../index'

export default class HistoryForward implements IpcChannelInterface {
  getName() {
    return 'history:forward'
  }

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void {
    main.mainWindow?.webContents.goForward()
    main.logger.log('going forward')
  }
}
