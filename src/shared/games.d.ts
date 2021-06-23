/* eslint-disable no-unused-vars */

export interface SheetItem {
  id: number
  name: string
  type: string
  icon: string
  value: any
  format(): string
}

export interface SheetItemGroup {
  id: number
  name: string
  type: 'group'
  icon: string
  items: SheetItem[]
}

export interface GameSheet {
  id: number
  name: string
  stats: any[]
  inventory: (SheetItem | SheetItemGroup)[]
}

export interface GameUser {
  id: number
  name: string
  status: 'active' | 'offline' | 'dnd' | 'idle'
  sheets: GameSheet[]
}

export interface GameView {
  id: number
  title: string
  type: 'webview' | 'canvas'
}

export interface GameViewWeb extends GameView {
  type: 'webview'
  url: string
}


export interface GameViewCanvas extends GameView {
  type: 'canvas'
  content: any
}

export interface Game {
  id: number
  name: string
  description: string
  users: GameUser[]
  vues: (GameView|GameViewWeb|GameViewCanvas)[]
}

export const Games: Game[]
