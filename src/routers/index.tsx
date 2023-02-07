import {Navigate, RouteObject} from "react-router";

const files: any = import.meta.glob("./*/*.tsx", {eager: true});
const routers: RouteObject[] = [];

Object.keys(files).forEach((fname) => {
  routers.push(files[fname].default);
});

export default routers;
