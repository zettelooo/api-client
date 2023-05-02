import { ZettelTypes } from '@zettelyay/api-types'
import { apiConfig } from '../../../apiConfig'

export class GetUpdates {
  private socket?: WebSocket
  private status!: GetUpdates.Status

  constructor(private readonly options: GetUpdates.Options) {
    this.setStatus(GetUpdates.Status.ClosedInitially)
  }

  private setStatus(status: GetUpdates.Status): void {
    if (this.status !== status) {
      this.status = status
      this.options.onStatusChange?.(status)
      switch (status) {
        case GetUpdates.Status.ClosedInitially:
          if (this.options.startInitially) {
            this.start()
          }
          break

        case GetUpdates.Status.Starting:
        case GetUpdates.Status.Started:
          // Do nothing!
          break

        case GetUpdates.Status.ClosedByClient:
        case GetUpdates.Status.ClosedByServer:
        case GetUpdates.Status.ClosedDueToServerOrNetworkFailure:
          if (typeof this.options.retryConnectionTimeoutMilliseconds === 'number') {
            setTimeout(() => this.start(), this.options.retryConnectionTimeoutMilliseconds)
          }
          break
      }
    }
  }

  getStatus(): GetUpdates.Status {
    return this.status
  }

  start(): void {
    if (this.status === GetUpdates.Status.Starting || this.status === GetUpdates.Status.Started) return

    this.setStatus(GetUpdates.Status.Starting)
    const baseUrl = this.options.extensionWsApiBaseUrl || apiConfig.baseUrls.ws
    this.socket = new WebSocket(`${baseUrl}/ws/extension/get-updates`)
    this.socket.binaryType = 'arraybuffer'
    const referencedSocket = this.socket!

    referencedSocket.onopen = event => {
      if (this.socket !== referencedSocket) return
      referencedSocket.send(
        GetUpdates.formatRequest({
          type: ZettelTypes.Services.Extension.WS.GetUpdates.Request.Type.Start,
          extensionAccessKey: this.options.extensionAccessKey,
        })
      )
    }

    referencedSocket.onmessage = async (event: MessageEvent<string>) => {
      if (this.socket !== referencedSocket) return
      const message = GetUpdates.parseResponse(event.data)
      switch (message.type) {
        case ZettelTypes.Services.Extension.WS.GetUpdates.Response.Type.Started:
          this.setStatus(GetUpdates.Status.Started)
          break

        case ZettelTypes.Services.Extension.WS.GetUpdates.Response.Type.Mutation:
          this.options.onMutation?.(message.entity)
          break
      }
    }

    referencedSocket.onclose = event => {
      if (this.socket !== referencedSocket) return
      this.close(
        event.wasClean ? GetUpdates.Status.ClosedByServer : GetUpdates.Status.ClosedDueToServerOrNetworkFailure
      )
    }

    referencedSocket.onerror = event => {
      if (this.socket !== referencedSocket) return
      this.close(GetUpdates.Status.ClosedDueToServerOrNetworkFailure)
    }
  }

  close(status = GetUpdates.Status.ClosedByClient): void {
    if (this.status === GetUpdates.Status.Starting || this.status === GetUpdates.Status.Started) {
      const { socket } = this
      delete this.socket
      if (socket?.readyState === WebSocket.CONNECTING || socket?.readyState === WebSocket.OPEN) {
        socket?.close()
      }
      this.setStatus(status)
    }
  }

  static formatRequest<T extends ZettelTypes.Services.Extension.WS.GetUpdates.Request.Type>(
    message: ZettelTypes.Services.Extension.WS.GetUpdates.Request<T>
  ): string {
    return JSON.stringify(message)
  }

  static parseResponse(message: string): ZettelTypes.Services.Extension.WS.GetUpdates.Response {
    return JSON.parse(message)
  }
}

export namespace GetUpdates {
  export interface Options {
    readonly extensionWsApiBaseUrl?: string
    readonly extensionAccessKey: string
    readonly startInitially?: boolean
    readonly retryConnectionTimeoutMilliseconds?: number
    readonly onStatusChange?: (status: Status) => void
    readonly onMutation?: (
      entity: ZettelTypes.Services.Extension.WS.GetUpdates.Response<ZettelTypes.Services.Extension.WS.GetUpdates.Response.Type.Mutation>['entity']
    ) => void
  }

  export enum Status {
    ClosedInitially = 'CLOSED_INITIALLY',
    Starting = 'STARTING',
    Started = 'STARTED',
    ClosedByClient = 'CLOSED_BY_CLIENT',
    ClosedByServer = 'CLOSED_BY_SERVER',
    ClosedDueToServerOrNetworkFailure = 'CLOSED_DUE_TO_SERVER_OR_NETWORK_FAILURE',
  }
}
