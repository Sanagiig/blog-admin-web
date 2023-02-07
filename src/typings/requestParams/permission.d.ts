type ReqAddPermissionBody = {
  name: string;
  code: string;
  type: string;
  value: string;
  description: string;
}

type ReqFindPermissionBody = {
  id?: string;
  role?:string[];
  name?: string;
  code?: string;
  type?: string;
  value?: string;
  description?: string;
}

type ReqUpdatePermissionBody = ReqAddPermissionBody & {
  id: string;
}

type ReqFindPermissionPagingBody = FindPermissionBody & ReqPaging

type ReqDeletePermissionBody = {
  ids:string[]
}