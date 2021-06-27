import { app } from 'electron'
import { platform } from 'os'
import { Service } from './Service'

export class BaseService extends Service {
  async getBasicInformation() {
    return {
      platform: platform(),
      version: app.getVersion(),
      root: app.getPath('userData')
    }
  }
}
