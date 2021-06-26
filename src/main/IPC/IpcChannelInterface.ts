import { IpcMainEvent } from 'electron'
import { Main } from '../index'

export interface IpcRequest {
  responseChannel?: string

  params?: string[]
}

export interface IpcChannelInterface {
  getName(): string

  handle(event: IpcMainEvent, main: Main, request: IpcRequest): void;
}
