import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {findRoleList} from "@/api/role"

export const asyncRoleList = createAsyncThunk(
  'roleApi/findRoleList',
  async (params:ReqFindRoleBody = {}, {dispatch}) => {
    const {data} = await findRoleList(params as any);
    return data
  }
)

const initRoleState = {
  roleList: {
    loading:false,
    data:[] as ResRole[]
  }
}
export const roleSlice = createSlice({
  name: "role",
  initialState: initRoleState,
  reducers: {
    syncRoleList: (state, action) => {
      state.roleList.data = action.payload
    }
  },
  extraReducers(builder){
    builder.addCase(asyncRoleList.pending,(state,action) =>{
      state.roleList.loading = true
    }).addCase(asyncRoleList.fulfilled,(state,action) =>{
      state.roleList.loading = false
      state.roleList.data = action.payload
    }).addCase(asyncRoleList.rejected,(state,action) =>{
      state.roleList.loading = false
      state.roleList.data = []
    })
  }
})


export const {syncRoleList} = roleSlice.actions
export const selectRoleList = (state: any):typeof initRoleState["roleList"]=> state.role.roleList

export default roleSlice.reducer;