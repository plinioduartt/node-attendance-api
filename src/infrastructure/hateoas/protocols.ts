import { Endpoint } from "@/src/http/protocols/routes"

export type Links = {
  [key: string]: {
    href: string
    method: string
  }
}

export type Hyperlink = {
  _links: Links
}

export type AvailableEndpoint = {
  method: string
  title: string
  pathname: string
  parameters: string[]
}

export type InjectEachCollectionArgs<T> = {
  involvedEndpoints: (keyof T)[]
  selfIdentity: keyof T
  items: any
  context: string
}

export type GetRootCollectionArgs<T> = {
  involvedEndpoints: (keyof T)[]
  selfIdentity: keyof T
  param?: string
  paramValue?: string
  withPagination?: boolean
  currentPage?: number
  lastPage?: number
  context: string
}

export type SetAvailableEndpointsArgs = {
  basePath: string
}

export type Container<T> = {
  context: string
  endpoints: Endpoint<T>[]
}