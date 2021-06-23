import { Service } from './Service'
import { BrowserWindow } from 'electron'

export class WindowsControl extends Service {
  minimize() {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.minimize()
  }

  maximize() {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.maximize()
  }

  unmaximize() {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.unmaximize()
  }

  close() {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.close()
  }

  toggle() {
    const win = BrowserWindow.getFocusedWindow()
    win?.isMaximized() ? this.unmaximize() : this.maximize()
  }

  isMaximized() {
    const win = BrowserWindow.getFocusedWindow()
    return win?.isMaximized()
  }
}
