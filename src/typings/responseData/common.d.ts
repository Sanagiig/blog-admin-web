
type ResListData<T = any> = T[]

type ResTableData<T = any> = {
  list: T[];
  total: number;
}

type ResponseDataType<Data = any> = {
  code: number;
  message?: string;
  errMsg?: string;
  data: Data
}

type ResponseInfo<Data = any> = ResponseDataType<Data>
type ResponseList<Data = any> = ResponseDataType<ResListData<Data>>
type ResponseTable<Data = any> = ResponseDataType<ResTableData<Data>>

type ResponseAsyncInfo<Data = any> = Promise<ResponseInfo<Data>>
type ResponseAsyncList<Data = any> = Promise<ResponseList<Data>>
type ResponseAsyncTable<Data = any> = Promise<ResponseTable<Data>>


