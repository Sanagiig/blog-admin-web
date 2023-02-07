import {RouteObject} from "react-router";
import {lazy} from "react";
import ManagerLayout from "@/components/layout/managerLayout";
const TagManager = lazy(() => import("@/pages/info/tag/index"));
const CategoryManager = lazy(() => import("@/pages/info/category/index"));
const DictionaryManager = lazy(() => import("@/pages/info/dictionary/index"));

const router: RouteObject = {
  id:"information-信息管理",
  path: "/information",
  element: <ManagerLayout />,
  children: [
    {
      id:"dictionaryManager-字典管理",
      path: "/information/dictionaryManager",
      element: <DictionaryManager />,
    },
    {
      id:"tagManager-标签管理",
      path: "/information/tagManager",
      element: <TagManager />,
    },
    {
      id:"categoryManager-分类管理",
      path: "/information/categoryManager",
      element: <CategoryManager />,
    },
  ],
};

export default router;
