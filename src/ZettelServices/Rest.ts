import { ZettelTypes, version } from '@zettelooo/api-types'
import { apiConfig } from '../apiConfig'

export class Rest<D extends ZettelTypes.Data = ZettelTypes.Data.Default> {
  private baseUrl: string

  constructor(private readonly options: Rest.Options) {
    this.baseUrl =
      options.extensionRestApi?.baseUrl ||
      apiConfig.baseUrlsByTargetEnvironment[options.extensionRestApi?.targetEnvironment ?? 'live'].rest
  }

  private requestFactory<Request, Response>(endPoint: string): (request: Request) => Promise<Response> {
    return async request => {
      const response = await fetch(`${this.baseUrl}/${version}/rest/${endPoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Key ${this.options.extensionAccessKey}`,
        },
        body: JSON.stringify(request),
      })
      if (!response.ok) throw Error(`${response.status}: ${response.statusText}`)
      return (await response.json()) as any
    }
  }

  getUsers = this.requestFactory<ZettelTypes.Service.Rest.GetUsers.Request, ZettelTypes.Service.Rest.GetUsers.Response>(
    'get-users'
  )

  getPages = this.requestFactory<
    ZettelTypes.Service.Rest.GetPages.Request,
    ZettelTypes.Service.Rest.GetPages.Response<D>
  >('get-pages')

  editPage = this.requestFactory<
    ZettelTypes.Service.Rest.EditPage.Request<D>,
    ZettelTypes.Service.Rest.EditPage.Response
  >('edit-page')

  getCards = this.requestFactory<
    ZettelTypes.Service.Rest.GetCards.Request,
    ZettelTypes.Service.Rest.GetCards.Response<D>
  >('get-cards')

  addCard = this.requestFactory<ZettelTypes.Service.Rest.AddCard.Request<D>, ZettelTypes.Service.Rest.AddCard.Response>(
    'add-card'
  )

  editCard = this.requestFactory<
    ZettelTypes.Service.Rest.EditCard.Request<D>,
    ZettelTypes.Service.Rest.EditCard.Response
  >('edit-card')
}

export namespace Rest {
  export interface Options {
    readonly extensionRestApi?: {
      readonly baseUrl?: string
      readonly targetEnvironment?: keyof typeof apiConfig.baseUrlsByTargetEnvironment
    }
    readonly extensionAccessKey: string
  }
}
