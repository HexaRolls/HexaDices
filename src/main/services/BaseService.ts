import { app } from 'electron'
import { platform } from 'os'
import { Service } from './Service'

export class BaseService extends Service {
  async getBasicInformation() {
    return {
      platform: platform(),
      version: app.getVersion(),
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      root: app.getPath('userData')
    }
  }
}
