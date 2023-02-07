import {Reducer} from "redux";

const reducerMap: {[key: string]: Reducer} = {};

const files: any = import.meta.glob("./*.ts", {eager: true});

Object.keys(files).forEach((path) => {
  const name = path?.slice(2)?.slice(0,-3)

  reducerMap[name] = files[path].default;
});

export default reducerMap;
