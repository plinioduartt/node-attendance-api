import GivenInvolvedEndpointNotExistsException from "../../hateoas/errors/GivenInvolvedEndpointNotExistsException"
import MissingInvolvedEndpointsException from "../../hateoas/errors/MissingInvolvedEndpointsException"
import MissingParameterException from "../../hateoas/errors/MissingParameterException"
import { AvailableEndpoint, GetRootCollectionArgs, InjectEachCollectionArgs, setAvailableEndpointsArgs } from "./protocols/hateoas"

enum HATEOAS_TYPE {
  COLLECTION = 'collection',
  SELF = 'self'
}

type Links = {
  [key: string]: {
    href: string
    method: string
  }
}

export type Hyperlink = {
  _links: Links
}

/**
 * @deprecated
 */
class Hateoas {
  private static readonly origin: string = 'http://localhost:3000'
  private constructor() { }

  /**
   * @param setAvailableEndpointsArgs
   * @property basePath: string 
   * @property router: Express Router 
   * @returns Returns an array of available endpoints of the given basepath that represents a entity
   */
  private static async setAvailableEndpoints({ basePath, router }: setAvailableEndpointsArgs): Promise<AvailableEndpoint[]> {
    let availableEndpoints: AvailableEndpoint[] = []

    for await (const stack of router.all(basePath).stack) {
      const title: string = stack.route?.stack[0]?.name?.replace('bound ', '')
      const method: string = stack.route?.stack[0]?.method?.toLocaleUpperCase()
      const pathname: string = `${basePath}${stack.route.path}`
      const parameters: string[] = stack.keys.map((key: any) => key.name)

      if (!!title && !!pathname && !!method) {
        const endpoint: AvailableEndpoint = {
          method,
          title,
          pathname,
          parameters
        }

        availableEndpoints.push(endpoint)
      }
    }

    return availableEndpoints
  }

  /**
   * @param InjectEachCollectionArgs 
   * @property involvedEndpoints. Example => ['list', 'retrieve', 'update', 'delete']
   * @property basePath. Example => /users
   * @property router. Express entity router instance
   * @property param. Description of the identifier param, example => id or _id 
   * @property items.
   * @returns 
   */
  static async injectEachCollection<T>({ involvedEndpoints, selfIdentity, basePath, router, items, param }: InjectEachCollectionArgs): Promise<T[]> {
    const availableEndpoints: AvailableEndpoint[] = await this.setAvailableEndpoints({ basePath, router })

    await Hateoas.validateInvolvedEndpoints(involvedEndpoints, availableEndpoints, selfIdentity)

    const filteredEndpoints: AvailableEndpoint[] = availableEndpoints
      .filter((availableEndpoint: AvailableEndpoint) =>
        involvedEndpoints.includes(availableEndpoint.title)
      )

    for await (const item of items) {
      for await (const endpoint of filteredEndpoints) {
        const title: string = endpoint.title === selfIdentity ?
          'self' : endpoint.title
        item._links = {
          ...item._links,
          [title]: {
            href: `${this.origin}${endpoint.pathname.replace(`:${param}`, Reflect.get(item, param))}`,
            method: endpoint.method
          },
        }
      }
    }

    return items
  }

  static async getRootCollection({ involvedEndpoints, selfIdentity, basePath, router, param, paramValue, withPagination, currentPage, lastPage }: GetRootCollectionArgs): Promise<Hyperlink> {
    let json: Hyperlink = {
      _links: {} as Links
    } as Hyperlink

    const availableEndpoints: AvailableEndpoint[] = await this.setAvailableEndpoints({ basePath, router })

    await Hateoas.validateInvolvedEndpoints(involvedEndpoints, availableEndpoints, selfIdentity)

    const filteredEndpoints: AvailableEndpoint[] = availableEndpoints
      .filter((availableEndpoint: AvailableEndpoint) =>
        involvedEndpoints.includes(availableEndpoint.title)
      )

    if (param) {
      if (!paramValue) {
        throw new MissingParameterException(400, `Parameter paramValue is missing.`)
      }
    }

    for await (const endpoint of filteredEndpoints) {
      const title: string = endpoint.title === selfIdentity ?
        'self' : endpoint.title
      json._links = {
        ...json._links,
        [title]: {
          href: `${this.origin}${endpoint.pathname.replace(`:${param}`, paramValue || '')}`,
          method: endpoint.method
        },
      }
    }

    // json._links = {
    //   self: {
    //     href: `${this.origin}${endpoint.pathname.replace(`:${param}`, paramValue || '')}`,
    //     method: endpoint.method
    //   },
    // }

    if (withPagination) {
      if (!currentPage) {
        throw new MissingParameterException(400, `Parameter currentPage is missing.`)
      }

      if (!lastPage) {
        throw new MissingParameterException(400, `Parameter lastPage is missing.`)
      }

      const selfEndpoint: AvailableEndpoint | undefined = availableEndpoints
        .find((endpoint: AvailableEndpoint) =>
          endpoint.title === selfIdentity
        )

      if (!selfEndpoint) {
        throw new GivenInvolvedEndpointNotExistsException(400, `The given "${selfEndpoint}" endpoint does not exists.`)
      }

      json._links = {
        ...json._links,
        first_page: {
          href: `${this.origin}${selfEndpoint.pathname.replace(`:${param}`, paramValue || '')}?page=1`,
          method: selfEndpoint.method
        },
        previous_page: {
          href: `${this.origin}${selfEndpoint.pathname.replace(`:${param}`, paramValue || '')}?page=${(currentPage - 1) <= 1 ? 1 : (currentPage - 1)}`,
          method: selfEndpoint.method
        },
        next_page: {
          href: `${this.origin}${selfEndpoint.pathname.replace(`:${param}`, paramValue || '')}?page=${(currentPage + 1)}`,
          method: selfEndpoint.method
        },
        last_page: {
          href: `${this.origin}${selfEndpoint.pathname.replace(`:${param}`, paramValue || '')}?page=${lastPage}`,
          method: selfEndpoint.method
        },
      }
    }


    return json
  }

  /**
   * 
   * @param involvedEndpoints 
   * @param availableEndpoints 
   */
  private static async validateInvolvedEndpoints(involvedEndpoints: string[], availableEndpoints: AvailableEndpoint[], selfIdentity: string): Promise<void> {
    if (!involvedEndpoints || (!!involvedEndpoints && involvedEndpoints.length === 0)) {
      throw new MissingInvolvedEndpointsException(400, 'involvedEndpoints parameter is missing.')
    }

    if (!involvedEndpoints.includes(selfIdentity)) {
      throw new GivenInvolvedEndpointNotExistsException(400, `Endpoint for ${selfIdentity} does not exists on involvedEndpoints given.`)
    }

    for await (const endpoint of involvedEndpoints) {
      const endpointExists: AvailableEndpoint | undefined = availableEndpoints
        .find((availableEndpoint: AvailableEndpoint) => {
          return availableEndpoint.title === endpoint
        })

      if (!endpointExists) {
        throw new GivenInvolvedEndpointNotExistsException(400, `The given "${endpoint}" endpoint does not exists.`)
      }
    }
  }
}

export default Hateoas

