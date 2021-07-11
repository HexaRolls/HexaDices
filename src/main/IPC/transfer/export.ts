import { IpcChannelInterface } from '../IpcChannelInterface'
import { app, IpcMainEvent, dialog } from 'electron'
import { Main } from '../../index'
import fs from 'fs'

export default class TransferExport implements IpcChannelInterface {
  getName() {
    return 'transfer:export'
  }

  handle(event: IpcMainEvent, main: Main, ipcRequest: any): void {
    if (typeof main.mainWindow === 'undefined') return

    dialog.showSaveDialog(main.mainWindow, {
      title: "Sélectionne l'emplacement d'exportation",
      defaultPath: app.getPath('downloads') + '/' + ipcRequest.file.name + '.' + ipcRequest.file.extension,
      buttonLabel: ipcRequest.label,
      filters: [
        {
          name: ipcRequest.file.type,
          extensions: [ipcRequest.file.extension]
        },
        {
          name: 'Tout type de ficher',
          extensions: ['*']
        }
      ]
    }).then(file => {
      if (file.canceled || typeof file.filePath === 'undefined') return

      fs.writeFile(
        file.filePath.toString(),
        ipcRequest.file.data,
        err => {
          if (err) console.error(err)

          event.sender.send('transfer:exported', [{
            filePath: file.filePath
          }, err])
        }
      )
    })
  }
}
