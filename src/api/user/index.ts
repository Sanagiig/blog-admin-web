import request from "../request/index";

export function register(data: RegisterBody) {
  return request.post("/api/user/register", data);
}

export function addUser(data: RegisterBody) {
  return request.post<ResponseInfo>("/api/user/add", data);
}

export function updateUser(data: RegisterBody) {
  return request.post<ResponseInfo>("/api/user/update", data);
}

export function deleteUser(data:{ids:string[]}) {
  return request.post<ResponseInfo>("/api/user/delete", data);
}

export function login(data: ReqLoginBody) {
  return request.post<ResponseInfo>("/api/user/login", data);
}

export function findSelfInfo() {
  return request.get<ResponseInfo>("/api/user/findSelfInfo");
}

export function findUserPaging(params: ReqFindUserPagingBody) {
  return request.get<ResponseTable<ResUserBaseInfo>>("/api/user/findPaging", {
    params
  });
}

export function findUserDetail(params: ReqFindUserBody){
  return request.get<ResponseInfo<ResUserDetailInfo>>("/api/user/findDetail", {
    params
  });
}

