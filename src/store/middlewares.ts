import {Store, Action, MiddlewareAPI, Dispatch} from "redux";
import {TestState, TestActions} from "./reducers/test";
// Store<TestState, Action<TestActions>>
export function logger({
  getState,
}: MiddlewareAPI<Dispatch<Action<TestActions>>, TestState>) {
  return (next: any) => {
    return (actions: Action<TestActions>) => {
      let res;
      console.log("while dispatch :", actions);
      res = next(actions);
      console.log("after dispatch :", getState(), res);
      return res;
    };
  };
}
