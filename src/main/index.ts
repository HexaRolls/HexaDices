import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import './dialog'
import { Logger } from './logger'
import { initialize } from './services'
import { autoUpdater } from 'electron-updater'
// import createBaseWorker from './workers/index?worker'
import indexPreload from '/@preload/index'
// import anotherPreload from '/@preload/another'
import indexHtmlUrl from '/@renderer/index.html'
// import sideHtmlUrl from '/@renderer/side.html'
import logoUrl from '/@static/logo.png'
import Store from 'electron-store'
import Bonjour from 'bonjour'
import { Client } from 'discord-rpc'
const bonjour = Bonjour()

const bonjourConfig = {
  name: 'HexaDices SelfHost Server',
  type: 'HDSS',
  port: 12060
}

Store.initRenderer()
let mainWindow: BrowserWindow

const client = new Client({ transport: 'ipc' })
const startTimestamp = new Date()

async function setActivity() {
  if (!client || !mainWindow) return
  mainWindow.webContents.send('discord:askRouteData')
}

async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
    // Auto-Update
    if (process.env.NODE_ENV === 'production') {
      try {
        autoUpdater.checkForUpdates()
      } catch (error) {
        logger.error(error)
      }
    }

    const mainWindow = createWindow()
    mainWindow.on('maximize', () => {
      mainWindow.webContents.send('maximize', null)
    })
    mainWindow.on('unmaximize', () => {
      mainWindow.webContents.send('minimize', null)
    })
    mainWindow.on('minimize', () => {
      mainWindow.webContents.send('minimize', null)
    })
    ipcMain.on('history:back', () => {
      mainWindow.webContents.goBack()
      console.log('going back')
    })
    ipcMain.on('history:forward', () => {
      mainWindow.webContents.goForward()
      console.log('going forward')
    })
    ipcMain.on('host:start', (e) => {
      try {
        const webServer = bonjour.publish(bonjourConfig)
        e.sender.send('host:started', webServer.host)
      } catch (error) {
        logger.error(error)
      }
    })
    ipcMain.on('host:stop', (e) => {
      bonjour.unpublishAll(() => {
        e.sender.send('host:stopped')
      })
    })
    ipcMain.on('host:search', (e) => {
      bonjour.find({
        type: 'HDSS'
      }, function (service: any) {
        e.sender.send('host:found', service)
      })
    })
    // const [x, y] = main.getPosition()
    // const side = createSecondWindow()
    // side.setPosition(x + 800 + 5, y)


    ipcMain.on('discord:routeData', (e, route) => {
      client.setActivity({
        details: route.meta.details || route.name,
        state: route.meta.state || undefined,
        startTimestamp,
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

    client.on('ready', () => {
      setActivity()

      setInterval(() => {
        setActivity()
      }, 15e3)
    })
  })
  // thread_worker example
  // createBaseWorker({ workerData: 'worker world' }).on('message', (message) => {
  //   logger.log(`Message from worker: ${message}`)
  // }).postMessage('')
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1400,
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

// function createSecondWindow() {
//   const sideWindow = new BrowserWindow({
//     height: 600,
//     width: 300,
//     webPreferences: {
//       preload: anotherPreload,
//       contextIsolation: true,
//       nodeIntegration: false
//     }
//   })

//   sideWindow.loadURL(sideHtmlUrl)
//   return sideWindow
// }

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

process.nextTick(main)

client.login({ clientId: '833448361738633287' }).catch(err => console.log(err))
