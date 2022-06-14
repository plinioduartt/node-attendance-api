import { Endpoint } from "@/src/http/protocols/routes"
import { GetRootCollectionArgs, Hyperlink, InjectEachCollectionArgs } from "./protocols"

interface IHateoas {
  registerContext<T>(context: string, endpoints: Endpoint<T>[]): void
  injectEachCollection<T, DataType>(args: InjectEachCollectionArgs<T>): Promise<DataType[]>
  getRootCollection<T>(args: GetRootCollectionArgs<T>): Promise<Hyperlink>
}

export default IHateoas