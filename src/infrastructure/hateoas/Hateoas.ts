import { Endpoint } from "@/src/http/protocols/routes"
import GivenInvolvedEndpointNotExistsException from "./errors/GivenInvolvedEndpointNotExistsException"
import InvalidParameterException from "./errors/InvalidParameterException"
import MissingInvolvedEndpointsException from "./errors/MissingInvolvedEndpointsException"
import MissingParameterException from "./errors/MissingParameterException"
import IHateoas from "./IHateoas"
import { Container, GetRootCollectionArgs, Hyperlink, InjectEachCollectionArgs, Links } from "./protocols"

// Singleton
class Hateoas implements IHateoas {
  private readonly origin: string = 'http://localhost:3000'
  protected containers: Container<any>[] = []

  constructor() { }

  /**
   * 
   * @param context Receives context as string (.i.e. "/users")
   * @param endpoints Receives registered endpoints for this context
   */
  public registerContext<T>(context: string, endpoints: Endpoint<T>[]): void {
    if (!context.includes('/')) {
      throw new InvalidParameterException(400, 'Invalid context.')
    }

    const containerExists = this.containers.find((container: Container<T>) =>
      container.context === context)

    if (!containerExists) {
      this.containers.push({
        context,
        endpoints
      })
    }
  }

  /**
   * 
   * @param args 
   * @returns 
   */
  public async injectEachCollection<T, D>(args: InjectEachCollectionArgs<T>): Promise<D[]> {
    const { involvedEndpoints, selfIdentity, items, context } = args

    const container: Container<T> | undefined = this.containers
      .find((container: Container<T>) => container.context === context)

    if (!container) {
      throw new InvalidParameterException(400, `Context not found.`)
    }

    await this._validateContext<T>(involvedEndpoints, selfIdentity, container)

    const filteredEndpoints: Endpoint<T>[] = container.endpoints
      .filter((endpoint: Endpoint<T>) =>
        involvedEndpoints.includes(endpoint.methodName)
      )

    for await (const item of items) {
      for await (const endpoint of filteredEndpoints) {
        const name: string = String(endpoint.methodName === selfIdentity ?
          'self' : endpoint.methodName)

        item._links = {
          ...item._links,
          [name]: {
            href: `${this.origin}${container.context}${endpoint.path.replace(`:${endpoint?.param}`, Reflect.get(item, endpoint?.param || ''))}`,
            method: endpoint.httpMethod.toLocaleUpperCase()
          },
        }
      }
    }

    return items
  }

  /**
   * 
   * @param args
   * @returns 
   */
  public async getRootCollection<T>(args: GetRootCollectionArgs<T>): Promise<Hyperlink> {
    const {
      involvedEndpoints,
      selfIdentity,
      param,
      paramValue,
      withPagination,
      currentPage,
      lastPage,
      context
    } = args

    let json: Hyperlink = {
      _links: {} as Links
    } as Hyperlink

    const container: Container<T> | undefined = this.containers
      .find((container: Container<T>) => container.context === context)

    if (!container) {
      throw new InvalidParameterException(400, `Context not found.`)
    }

    // Validate all involvedEndpoints and selfIdentity given
    await this._validateContext<T>(involvedEndpoints, selfIdentity, container)

    // Filter endpoints with only involvedEndpoints given 
    const filteredEndpoints: Endpoint<T>[] = container.endpoints
      .filter((endpoint: Endpoint<T>) =>
        involvedEndpoints.includes(endpoint.methodName)
      )

    if (param) {
      if (!paramValue) {
        throw new MissingParameterException(400, `Parameter paramValue is missing.`)
      }
    }

    // Async iterate to construct all involvedEndpoints links collection
    for await (const endpoint of filteredEndpoints) {
      const title: string = String(endpoint.methodName === selfIdentity ?
        'self' : endpoint.methodName)

      json._links = {
        ...json._links,
        [title]: {
          href: `${this.origin}${container.context}${endpoint.path.replace(`:${param}`, paramValue || '')}`,
          method: endpoint.httpMethod.toLocaleUpperCase()
        },
      }
    }

    // Construct pagination collection
    if (withPagination) {
      if (!currentPage) {
        throw new MissingParameterException(400, `Parameter currentPage is missing.`)
      }

      if (!lastPage) {
        throw new MissingParameterException(400, `Parameter lastPage is missing.`)
      }

      const selfEndpoint: Endpoint<T> | undefined = container.endpoints
        .find((endpoint: Endpoint<T>) =>
          endpoint.methodName === selfIdentity
        )

      if (!selfEndpoint) {
        throw new GivenInvolvedEndpointNotExistsException(400, `The given "${selfEndpoint}" endpoint does not exists.`)
      }

      const selfEndpointPathname: string = selfEndpoint.path.replace(`:${param}`, paramValue || '')
      const selfEndpointHttpMethod: string = selfEndpoint.httpMethod.toLocaleUpperCase()

      json._links = {
        ...json._links,
        first_page: {
          href: `${this.origin}${container.context}${selfEndpointPathname}?page=1`,
          method: selfEndpointHttpMethod
        },
        previous_page: {
          href: `${this.origin}${container.context}${selfEndpointPathname}?page=${(currentPage - 1) <= 1 ? 1 : (currentPage - 1)}`,
          method: selfEndpointHttpMethod
        },
        next_page: {
          href: `${this.origin}${container.context}${selfEndpointPathname}?page=${(currentPage + 1)}`,
          method: selfEndpointHttpMethod
        },
        last_page: {
          href: `${this.origin}${container.context}${selfEndpointPathname}?page=${lastPage}`,
          method: selfEndpointHttpMethod
        },
      }
    }

    return json
  }

  /**
   * @param involvedEndpoints
   * @param selfIdentity
   */
  private async _validateContext<T>(involvedEndpoints: (keyof T)[], selfIdentity: keyof T, container: Container<T>): Promise<void> {
    if (!involvedEndpoints || (!!involvedEndpoints && involvedEndpoints.length === 0)) {
      throw new MissingInvolvedEndpointsException(400, 'involvedEndpoints parameter is missing.')
    }

    if (!involvedEndpoints.includes(selfIdentity)) {
      throw new GivenInvolvedEndpointNotExistsException(400, `Endpoint for ${String(selfIdentity)} does not exists on involvedEndpoints given.`)
    }

    for await (const involvedEndpoint of involvedEndpoints) {
      const endpointExists: Endpoint<T> | undefined = container.endpoints
        .find((endpoint: Endpoint<T>) => {
          return endpoint.methodName === involvedEndpoint
        })

      if (!endpointExists) {
        throw new GivenInvolvedEndpointNotExistsException(400, `The given "${String(involvedEndpoint)}" endpoint does not exists in this context.`)
      }
    }
  }
}

export default new Hateoas()

