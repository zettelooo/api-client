import { ZettelTypes } from '@zettelyay/api-types'
import { apiConfig } from '../../apiConfig'

export class Rest {
  private baseUrl: string

  constructor(private readonly options: Rest.Options) {
    this.baseUrl =
      options.extensionRestApi?.baseUrl ||
      apiConfig.baseUrlsByTargetEnvironment[options.extensionRestApi?.targetEnvironment ?? 'live'].rest
  }

  private requestFactory<Request, Response>(endPoint: string): (request: Request) => Promise<Response> {
    return async request => {
      const response = await fetch(`${this.baseUrl}/rest/extension/${endPoint}`, {
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

  getUsers = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetUsers.Request,
    ZettelTypes.Service.Extension.Rest.GetUsers.Response
  >('get-users')

  getPages = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetPages.Request,
    ZettelTypes.Service.Extension.Rest.GetPages.Response
  >('get-pages')

  getPageMembers = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetPageMembers.Request,
    ZettelTypes.Service.Extension.Rest.GetPageMembers.Response
  >('get-page-members')

  getCards = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetCards.Request,
    ZettelTypes.Service.Extension.Rest.GetCards.Response
  >('get-cards')

  setPageExtensionData = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.SetPageExtensionData.Request,
    ZettelTypes.Service.Extension.Rest.SetPageExtensionData.Response
  >('set-page-extension-data')

  addCard = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.AddCard.Request,
    ZettelTypes.Service.Extension.Rest.AddCard.Response
  >('add-card')

  editCard = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.EditCard.Request,
    ZettelTypes.Service.Extension.Rest.EditCard.Response
  >('edit-card')

  addBadge = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.AddBadge.Request,
    ZettelTypes.Service.Extension.Rest.AddBadge.Response
  >('add-badge')
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
