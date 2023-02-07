import {configureStore} from "@reduxjs/toolkit";
import reducerMap from "./reducers";
// import apiReducer, {userSlice} from "./apiSlice";
function devTool(): any {
  return (
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}
export default configureStore({
  reducer: {
    ...reducerMap,
    // [userSlice.reducerPath]: apiReducer,
  },
  // middleware: (getDefault) => getDefault().concat(userSlice.middleware),
});
