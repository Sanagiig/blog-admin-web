type ResRole = {
  id: string;
  name: string;
  code: string;
  type: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

type ResRoleDetail = ResRole &{
  permissions: ResPermission[];
  description: string;
}

type ResRolePaging = {
  id: string;
  name: string;
  code: string;
  type: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
