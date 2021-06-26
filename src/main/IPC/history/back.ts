import { IpcChannelInterface, IpcRequest } from '../IpcChannelInterface'
import { IpcMainEvent } from 'electron'
import { Main } from '../../index'

export default class HistoryBack implements IpcChannelInterface {
  getName() {
    return 'history:back'
  }

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void {
    main.mainWindow?.webContents.goBack()
    main.logger.log('going back')
  }
}
