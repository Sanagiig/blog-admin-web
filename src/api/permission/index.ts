import request from "../request/index";

export function addPermission(data: ReqAddPermissionBody) {
  return request.post("/api/permission/add", data);
}

export function updatePermission(data: ReqUpdatePermissionBody) {
  return request.post("/api/permission/update", data);
}

export function findPermission(params: ReqFindPermissionBody) {
  return request.get<ResponseInfo<ResPermissionDetail>>("/api/permission/find", {params});
}

export function findPermissionList(data: ReqFindPermissionBody) {
  return request.post<ResponseList<ResPermission>>("/api/permission/findList", data);
}

export function findPermissionPaging(data: ReqFindPermissionPagingBody) {
  return request.post<ResponseTable<ResPermissionPaging>>("/api/permission/findPaging", data);
}

export function deletePermission(data: ReqDeletePermissionBody) {
  return request.post("/api/permission/delete", data);
}
