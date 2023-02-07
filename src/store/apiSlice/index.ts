// import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
// import {findRoleList} from "@/api/role"
// export const roleSlice = createSlice({
//   name:"roleApi",
//   initialState:{
//     roleList:[]
//   },
//   reducers:{
//     syncRoleList:(state,action) =>{
//       state.roleList = action.payload
//     }
//   }
// })
//
// export default roleSlice.reducer;
// export const actions = roleSlice.actions
//
// export const syncRoleList = createAsyncThunk(
//     'roleApi/findRoleList',
//     async (params,action) => {
//       const response = await findRoleList(params as any);
//       action.dispatch(actions.syncRoleList(response.data));
//       // return response.data;
//     }
// )