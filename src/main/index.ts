// Libs
import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import { initRenderer } from 'electron-store'
import { autoUpdater } from 'electron-updater'
import { debounce } from 'lodash'
import { Client } from 'discord-rpc'

import electronWindowState from 'electron-window-state'
import Bonjour from 'bonjour'

// Utils
import { initialize } from './services'
import { Logger } from './logger'
import './dialog'

// Preload
import indexPreload from '/@preload/index'

// Renderer
import indexHtmlUrl from '/@renderer/index.html'

// Static Assets
import logoUrl from '/@static/logo.png'

/**
 * Primary Class for main process
 *
 * @class Main
 */
class Main {
  private mainWindow?: BrowserWindow
  private logger = new Logger()
  private client = new Client({ transport: 'ipc' })
  private startTimestamp = new Date()
  private bonjour = Bonjour()

  private clientID: string = '833448361738633287'
  private windowState = electronWindowState({
    defaultWidth: 1400,
    defaultHeight: 800
  })

  private bonjourConfig = {
    name: 'HexaDices SelfHost Server',
    type: 'HDSS',
    port: 12060
  }

  init() {
    if (!app.requestSingleInstanceLock()) {
      app.quit()
    }

    initRenderer()
    this.logger.initialize(app.getPath('userData'))
    initialize(this.logger)

    app.on('ready', this.onReady.bind(this))
    app.on('window-all-closed', this.onWindowAllClosed.bind(this))
    app.on('activate', this.onActivate.bind(this))

    this.client.login({ clientId: this.clientID }).catch(err => this.logger.error(err))
  }

  onReady() {
    this.mainWindow = this.createWindow()

    // Auto-Update
    if (process.env.NODE_ENV === 'production') {
      try {
        this.logger.log('Checking for update...')
        autoUpdater.checkForUpdates()
      } catch (error) {
        this.logger.error(error)
      }
    }

    this.mainWindow.on('resize', debounce(this.windowState.saveState, 500))
    this.mainWindow.on('move', debounce(this.windowState.saveState, 500))

    this.mainWindow.on('maximize', () => {
      this.mainWindow?.webContents.send('maximize', null)
    })
    this.mainWindow.on('unmaximize', () => {
      this.mainWindow?.webContents.send('minimize', null)
    })
    this.mainWindow.on('minimize', () => {
      this.mainWindow?.webContents.send('minimize', null)
    })
    ipcMain.on('history:back', () => {
      this.mainWindow?.webContents.goBack()
      console.log('going back')
    })
    ipcMain.on('history:forward', () => {
      this.mainWindow?.webContents.goForward()
      console.log('going forward')
    })
    ipcMain.on('host:start', (e) => {
      try {
        const webServer = this.bonjour.publish(this.bonjourConfig)
        e.sender.send('host:started', webServer.host)
      } catch (error) {
        this.logger.error(error)
      }
    })
    ipcMain.on('host:stop', (e) => {
      this.bonjour.unpublishAll(() => {
        e.sender.send('host:stopped')
      })
    })
    ipcMain.on('host:search', (e) => {
      this.bonjour.find({
        type: 'HDSS'
      }, function (service: any) {
        e.sender.send('host:found', service)
      })
    })

    ipcMain.on('discord:routeData', (e, route) => {
      this.client.setActivity({
        details: route.meta.details || route.name,
        state: route.meta.state || undefined,
        startTimestamp: this.startTimestamp,
        largeImageKey: route.meta.largeImageKey || 'hexagon_hexadices_dark_512x512',
        largeImageText: route.meta.largeImageText || (typeof route.meta.details !== 'undefined') ? route.name : undefined,
        smallImageKey: route.meta.smallImageKey || undefined,
        smallImageText: route.meta.smallImageText || undefined,
        partySize: route.meta.partySize || 0,
        partyMax: route.meta.partyMax || 0,
        instance: !!route.meta.partyId || false,
        partyId: route.meta.partyId || undefined
      })
    })

    autoUpdater.on('update-downloaded', () => {
      autoUpdater.quitAndInstall()
    })

    this.client.on('ready', () => {
      this.setActivity()

      setInterval(() => {
        this.setActivity()
      }, 15e3)
    })
  }

  async setActivity() {
    if (!this.client || !this.mainWindow) return
    this.mainWindow.webContents.send('discord:askRouteData')
  }

  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  onActivate() {
    if (!this.mainWindow) {
      this.createWindow()
    }
  }

  createWindow() {
    const mainWindow = new BrowserWindow({
      x: this.windowState.x,
      y: this.windowState.y,

      width: this.windowState.width,
      height: this.windowState.height,

      webPreferences: {
        preload: indexPreload,
        contextIsolation: true,
        nodeIntegration: false,
        webviewTag: true
      },

      icon: logoUrl,
      frame: false,
      backgroundColor: '#232430'
    })

    nativeTheme.themeSource = 'dark'
    mainWindow.loadURL(indexHtmlUrl)

    return mainWindow
  }
}

(new Main()).init()
