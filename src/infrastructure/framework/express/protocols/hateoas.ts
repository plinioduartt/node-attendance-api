import { Router } from "express"

export type AvailableEndpoint = {
  method: string
  title: string
  pathname: string
  parameters: string[]
}

export type InjectEachCollectionArgs = {
  involvedEndpoints: string[]
  selfIdentity: string
  basePath: string
  router: Router
  items: any
  param: string
}

export type GetRootCollectionArgs = {
  involvedEndpoints: string[]
  selfIdentity: string
  basePath: string
  router: Router
  param?: string
  paramValue?: string
  withPagination?: boolean
  currentPage?: number
  lastPage?: number
}

export type setAvailableEndpointsArgs = {
  basePath: string
  router: Router
}