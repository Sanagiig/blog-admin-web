import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {message} from "antd";
import env from "@/global/env";
import {isRedicrectToLogin} from "./acl";
import err from "@/global/errors";

const {baseURL} = env;

type NoDataMethods = "get" | "delete" | "head" | "options"
type Methods = "patch" | "post" | "put" | "postForm" | "putForm" | "patchForm"
type RequestInstance = Omit<AxiosInstance, NoDataMethods | Methods> & {
  get: <Data = ResponseDataType, Params = any> (url: string, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  delete: <Data = ResponseDataType, Params = any> (url: string, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  head: <Data = ResponseDataType, Params = any> (url: string, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  patch: <Data = ResponseDataType, Params = any> (url: string, data: Params, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  post: <Data = ResponseDataType, Params = any> (url: string, data: Params, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  put: <Data = ResponseDataType, Params = any> (url: string, data: Params, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  postForm: <Data = ResponseDataType, Params = any> (url: string, data: Params, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  putForm: <Data = ResponseDataType, Params = any> (url: string, data: Params, config?: AxiosRequestConfig<Params>) => Promise<Data>;
  patchForm: <Data = ResponseDataType, Params = any> (url: string, data: Params, config?: AxiosRequestConfig<Params>) => Promise<Data>;
}
const request: RequestInstance = axios.create({
  baseURL,
  timeout: 1500,
  withCredentials: true,
});

request.interceptors.request.use(
  (req) => {
    return req;
  },
  (err) => {
    console.error("req err", err);
    message.error(err)
  },
);

request.interceptors.response.use(
  (res) => {

    if (isRedicrectToLogin(res.data)) {
      location.href = "/login"
      return
    }

    if (res.data.code >= 400) {
      message.error(res.data.message);
      throw new Error(res.data.message)
    }

    return res.data;
  },
  ({response}) => {
    let msg = "请求失败"
    if (!response) {
      message.error(err.FAILED)
    } else if (response.status >= 400) {
      switch (response.status) {
        case 404:
          msg = err.NOT_FOUND
          break
        default:
          msg = err.SERVER_ERROR
      }
    }

    message.error(msg)
    throw new Error(msg)
  },
);

export default request;
