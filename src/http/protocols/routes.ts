import { HttpMethods } from "./http";

export type Endpoint<T> = {
  httpMethod: HttpMethods;
  // Expected method name in a controller. (i.e. "findAll" or "create")
  methodName: keyof T;
  // URL path (i.e. "/" or "/:id")
  path: string;
  // Default param identity for request (i.e. "id" or "_id")
  param?: string;

  // Applied middlewares
  middlewares?: any
};