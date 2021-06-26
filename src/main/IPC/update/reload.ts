import { IpcChannelInterface, IpcRequest } from '../IpcChannelInterface'
import { IpcMainEvent } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Main } from '../../index'

export default class UpdateReload implements IpcChannelInterface {
  getName() {
    return 'update:reload'
  }

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void {
    autoUpdater.quitAndInstall(true, true)
  }
}
