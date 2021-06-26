import { IpcChannelInterface, IpcRequest } from '../IpcChannelInterface'
import { IpcMainEvent } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Main } from '../../index'
import { app } from 'electron'

export default class UpdateCheck implements IpcChannelInterface {
  getName() {
    return 'update:check'
  }

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void {
    autoUpdater.checkForUpdates().then(data => {
      main.logger.log(data.updateInfo)
      event.sender.send('update:checked', data.updateInfo)
    }).catch(err => {
      main.logger.error(err)
      event.sender.send('update:checked', err)
    })
  }
}
