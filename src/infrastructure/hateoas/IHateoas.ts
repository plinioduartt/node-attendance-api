import { Endpoint } from "@/src/http/protocols/routes"
import { GetRootCollectionArgs, Hyperlink, InjectEachCollectionArgs } from "./protocols"

interface IHateoas<T> {
  registerContext(context: string): void
  registerEndpoints(endpoints: Endpoint<T>[]): void
  injectEachCollection<DataType>(args: InjectEachCollectionArgs<T>): Promise<DataType[]>
  getRootCollection(args: GetRootCollectionArgs<T>): Promise<Hyperlink>
}

export default IHateoas