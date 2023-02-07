type UploadType = "profile"

type ReqUploadFile = {
  type:string
}

type ReqUploadAuthBody = {
  username?:string
  uploadType:UploadType
}

type ReqUploadBody = ReqUploadAuthBody & {
  file: File;
}