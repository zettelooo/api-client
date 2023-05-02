import { ZettelTypes } from '@zettelyay/api-types'
import { apiConfig } from '../../apiConfig'

export class Rest {
  private baseUrl: string

  constructor(private readonly options: Rest.Options) {
    this.baseUrl = options?.extensionRestApiBaseUrl || apiConfig.baseUrls.rest
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
    ZettelTypes.Services.Extension.REST.GetUsers.Request,
    ZettelTypes.Services.Extension.REST.GetUsers.Response
  >('get-users')

  getPages = this.requestFactory<
    ZettelTypes.Services.Extension.REST.GetPages.Request,
    ZettelTypes.Services.Extension.REST.GetPages.Response
  >('get-pages')

  getPageMembers = this.requestFactory<
    ZettelTypes.Services.Extension.REST.GetPageMembers.Request,
    ZettelTypes.Services.Extension.REST.GetPageMembers.Response
  >('get-page-members')

  getCards = this.requestFactory<
    ZettelTypes.Services.Extension.REST.GetCards.Request,
    ZettelTypes.Services.Extension.REST.GetCards.Response
  >('get-cards')

  setPageExtensionManagedData = this.requestFactory<
    ZettelTypes.Services.Extension.REST.SetPageExtensionManagedData.Request,
    ZettelTypes.Services.Extension.REST.SetPageExtensionManagedData.Response
  >('set-page-extension-managed-data')

  addCard = this.requestFactory<
    ZettelTypes.Services.Extension.REST.AddCard.Request,
    ZettelTypes.Services.Extension.REST.AddCard.Response
  >('add-card')

  editCard = this.requestFactory<
    ZettelTypes.Services.Extension.REST.EditCard.Request,
    ZettelTypes.Services.Extension.REST.EditCard.Response
  >('edit-card')

  addBadge = this.requestFactory<
    ZettelTypes.Services.Extension.REST.AddBadge.Request,
    ZettelTypes.Services.Extension.REST.AddBadge.Response
  >('add-badge')
}

export namespace Rest {
  export interface Options {
    readonly extensionRestApiBaseUrl?: string
    readonly extensionAccessKey: string
  }
}
