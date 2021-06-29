import { IpcChannelInterface } from '../IpcChannelInterface'
import { app, IpcMainEvent } from 'electron'
import { Main } from '../../index'
import { request } from 'https'
import { platform } from 'os'

export default class FeedbackSendReport implements IpcChannelInterface {
  getName() {
    return 'feedback:sendReport'
  }

  handle(event: IpcMainEvent, main: Main, ipcRequest: any): void {
    const data = {
      content: 'Nouveau report de bug',
      embeds: [
        {
          title: ipcRequest.title,
          description: ipcRequest.description,
          fields: [] as any[]
        }
      ]
    }

    function getBasicInformation() {
      return {
        platform: platform() as string,
        version: app.getVersion(),
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
        root: app.getPath('userData'),
        [Symbol.iterator]: function * () {
          const data = Object.entries(this)
          for (const value of data) {
            yield value
          }
        }
      }
    }

    const systemInfo = getBasicInformation()
    if (ipcRequest.auths.length) {
      ipcRequest.auths.forEach((auth: string) => {
        const [key, value] = [...systemInfo].find(([key]) => key === auth) as string[]
        if (typeof value === 'undefined') return
        data.embeds[0].fields.push({
          name: key,
          value: value,
          inline: true
        })
      })
    }

    const finalData = JSON.stringify(data)

    const options = {
      hostname: 'discord.com',
      port: 443,
      path: '/api/webhooks/859008336279502849/fEU5achiNwy2e7N2haHemPxeDlGvWREyCCQdWZFrJIVRFZV4gUn6sd6RRrlRPPmrcbbv',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': finalData.length
      }
    }

    const req = request(options, res => {
      main.logger.log(`statusCode: ${res.statusCode}`)
      event.sender.send('feedback:sendedReport', [res.statusCode, null])
    })

    req.on('error', error => {
      main.logger.error(error)
      event.sender.send('feedback:sendedReport', [null, error.message])
    })

    req.write(finalData)
    req.end()
  }
}
