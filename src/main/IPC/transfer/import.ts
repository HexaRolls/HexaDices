import { IpcChannelInterface } from '../IpcChannelInterface'
import { app, IpcMainEvent, dialog } from 'electron'
import { Main } from '../../index'
import fs from 'fs'

export default class TransferImport implements IpcChannelInterface {
  getName() {
    return 'transfer:import'
  }

  handle(event: IpcMainEvent, main: Main, ipcRequest: any): void {
    if (typeof main.mainWindow === 'undefined') return

    dialog.showOpenDialog(main.mainWindow, {
      title: 'Sélectionne le fichier a importer',
      defaultPath: app.getPath('downloads'),
      buttonLabel: ipcRequest.label,
      properties: ['openFile'],
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
      if (file.canceled || !file.filePaths.length) return

      fs.readFile(
        file.filePaths[0].toString(),
        (err, data) => {
          if (err) console.error(err)

          event.sender.send('transfer:imported', [{
            filePath: file.filePaths[0],
            data: data.toString('utf-8')
          }, err])
        }
      )
    })
  }
}
