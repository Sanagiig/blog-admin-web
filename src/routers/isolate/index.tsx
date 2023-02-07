import {RouteObject, Navigate} from "react-router";
import {lazy} from "react";

const Register = lazy(() => import("@/pages/user/register"));
const Login = lazy(() => import("@/pages/user/login/index"));
const About = lazy(() => import("@/pages/isolate/about"));
const NotFound = lazy(() => import("@/pages/isolate/notFound"));

const router: RouteObject = {
  id:"isolate",
  path: "/",
  children: [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/notFound",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/notFound" />,
    },
  ],
};

export default router;
