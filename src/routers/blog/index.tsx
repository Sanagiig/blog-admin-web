import {RouteObject} from "react-router";
import {lazy} from "react";
import ManagerLayout from "@/components/layout/managerLayout";
const ArticleManage = lazy(() => import("@/pages/blog/article/index"));
const CommentManage = lazy(() => import("@/pages/blog/comment/index"));
const ReplyManage = lazy(() => import("@/pages/blog/reply/index"));

const router: RouteObject = {
  id:"blog-博客管理",
  path: "/blog",
  element: <ManagerLayout />,
  children: [
    {
      id:"articleManager-文章管理",
      path: "/blog/articleManage",
      element: <ArticleManage />,
    },
    {
      id:"commentManager-评论管理",
      path: "/blog/commentManage",
      element: <CommentManage />,
    },
    {
      id:"replyManager-回复管理",
      path: "/blog/replyManage",
      element: <ReplyManage />,
    },
  ],
};

export default router;
