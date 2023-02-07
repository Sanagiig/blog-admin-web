import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import { increment } from "./counterSlice";
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export const add3 = (dispatch: any, getState: any) =>{
  let i = 0;
  const go = () => {
    setTimeout(() => {
      dispatch(increment());
      if (i < 3) {
        i++;
        go();
      }
    }, 1000);
  };

  go();
}

store.dispatch(add3)
export default store;
