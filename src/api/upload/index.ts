import request from "@/api/request";
import * as qiniu from "qiniu-js"

const accessKey = "6r7Nu2NE0aR-_DMOWSUaJcQidPPE8WIL5XljcjLJ"

export function uploadFile(params: ReqUploadBody) {
  const formData = new FormData()
  formData.append("file",params.file)
  return request.post<ResponseInfo<string>>(
    "/api/upload/file/" + params.uploadType,formData, {
      'Content-type' : 'multipart/form-data'
    } as any
  )
}

export function getUploadAuth(params: ReqUploadAuthBody) {
  return request.get<ResponseInfo<ResUploadAuth>>("/api/upload/getAuth", {params})
}

export async function uploadFile2QiNiu(params: ReqUploadBody) {
  const {username, uploadType, file} = params
  const {data}: any = await getUploadAuth({username, uploadType})

  return new Promise<ResUploadFile>((res, rej) => {
    const observable = qiniu.upload(file, data.key, data.upToken)
    const subscription = observable.subscribe({
      complete(value) {
        res(value)
      },
      error(e){
        rej(new Error("上传失败"))
      }
    })
  })
}

export async function getImg() {
  return await qiniu.imageInfo("profile/xx.xx", "http://rlrbsfeki.hn-bkt.clouddn.com").then(res => res)
  // return await  qiniu.imageInfo("6r7Nu2NE0aR-_DMOWSUaJcQidPPE8WIL5XljcjLJ", "http://rkpkqnz39.hn-bkt.clouddn.com").then(res => res)
}
