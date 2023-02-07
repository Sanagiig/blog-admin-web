import { Provider } from "react-redux";
import {Counter} from "./counter";
import store from "./store"
export default function Test() {
  return (
    <Provider store={store}>
      <Counter></Counter>
    </Provider>
  );
}
