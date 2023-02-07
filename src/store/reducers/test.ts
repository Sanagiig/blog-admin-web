import {Action} from "redux";
import {createSlice} from "@reduxjs/toolkit";
export type TestActions = "add" | "minus";
export type TestState = {value: number};

export const testSlice = createSlice({
  name: "test",
  initialState: {
    value: 0,
  },
  reducers: {
    add(state) {
      state.value++;
    },
    minus(state) {
      state.value--;
    },
  },
});

export default function testReducer(
  state: TestState = {value: 0},
  action: Action<TestActions>,
) {
  switch (action.type) {
    case "add":
      return {...state, value: state.value + 1};
    case "minus":
      return {...state, value: state.value - 1};
    default:
      return state;
  }
}

export const selectCount = (state: any) => state.test.value;

export const add = (): Action => ({type: "add"});
export const minus = (): Action => ({type: "minus"});
