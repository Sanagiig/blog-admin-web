import {RouteObject} from "react-router";
import {lazy} from "react";
import ManagerLayout from "@/components/layout/managerLayout";
const Role = lazy(() => import("@/pages/auth/role/index"));
const Permission = lazy(() => import("@/pages/auth/permission"));

const router: RouteObject = {
  id:"authority-权限管理",
  path: "/authority",
  element: <ManagerLayout />,
  children: [
    {
      id:"roleManager-角色管理",
      path: "/authority/roleManage",
      element: <Role />,
    },
    {
      id:"permissionManage-权限管理",
      path: "/authority/permissionManage",
      element: <Permission />,
    },
  ],
};

export default router;
