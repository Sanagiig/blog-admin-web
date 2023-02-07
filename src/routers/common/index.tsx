import {RouteObject} from "react-router";
import {lazy} from "react";
import ManagerLayout from "@/components/layout/managerLayout";
const Home = lazy(() => import("@/pages/common/home"));
const Test = lazy(() => import("@/pages/test/index"));

const router: RouteObject = {
  id: "common",
  path: "/",
  element: <ManagerLayout/>,
  children: [
    {
      id: "test-测试组",
      path: "/test",
      element: <Test/>,
      children: [{
        id: "test1-测试1",
        path: "/test",
        element: <Test/>,
      }]
    },
    {
      index:true,
      id: "home-主页",
      path: "/home",
      element: <Home/>,
    },
  ],
};

export default router;
