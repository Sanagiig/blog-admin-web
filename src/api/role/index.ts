import request from "../request/index";

export function addRole(data: ReqAddRoleBody) {
  return request.post("/api/role/add", data);
}

export function updateRole(data: ReqUpdateRoleBody) {
  return request.post("/api/role/update", data);
}

export function findRole(params: ReqFindRoleBody) {
  return request.get<ResponseInfo<ResRoleDetail>>("/api/role/find", {params});
}

export function findRoleList(data: ReqFindRoleBody) {
  return request.post<ResponseList<ResRole>>("/api/role/findList", data);
}

export function findRolePaging(data: ReqPathOperatePermissionBody) {
  return request.post<ResponseTable<ResRole>>("/api/role/findPaging", data);
}

export function deleteRole(data: ReqDeleteRoleBody) {
  return request.post("/api/role/delete", data);
}

export function patchAddRole(data: RegisterBody) {
  return request.post("/api/role/patchAddRole", data);
}

export function patchRemoveRole(data: RegisterBody) {
  return request.post("/api/role/patchRemoveRole", data);
}
