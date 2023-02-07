import {RouteObject} from "react-router";
import {lazy} from "react";
import ManagerLayout from "@/components/layout/managerLayout";
const UserList = lazy(() => import("@/pages/user/userList/index"));

const router: RouteObject = {
  id:"user-用户管理",
  path: "/user",
  element: <ManagerLayout />,
  children: [
    {
      id:"userList-用户列表",
      path: "/user/userList",
      element: <UserList />,
    },
  ],
};

export default router;
