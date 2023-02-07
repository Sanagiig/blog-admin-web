type ReqAddRoleBody = {
  name: string;
  code: string;
  type: string;
  value: string;
  description: string;
}

type ReqFindRoleBody = {
  id?: string;
  role?: string[];
  name?: string;
  code?: string;
  type?: string;
  value?: string;
  description?: string;
}

type ReqUpdateRoleBody = ReqAddRoleBody & {
  id: string;
}

type ReqFindRolePagingBody = FindRoleBody & ReqPaging

type ReqDeleteRoleBody = {
  ids: string[]
}

type ReqPathOperatePermissionBody = {
  roleIds: string[];
  permissionIds: string[];
}