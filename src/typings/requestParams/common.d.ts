type ReqPaging = {
  page: number;
  pageSize: number
}

type FindInfoFn<P = any, ResData = any> = (params: P) => ResponseAsyncInfo<ResData>
type FindListFn<P = any, ResData = any> = (params: P) => ResponseAsyncList<ResData>
type FindTableFn<P = any, ResData = any> = (params: P) => ResponseAsyncTable<ResData>