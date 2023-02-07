import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {findPermissionList} from "@/api/permission";
import {findAllDictionaryChildren, findDictionaryList} from "@/api/dictionary";

export const asyncPermissionList = createAsyncThunk(
  'permissionApi/findPermissionList',
  async (params: ReqFindRoleBody, {dispatch}) => {
    const {data} = await findPermissionList(params);
    return data
  }
)

export const asyncPermissionTypes = createAsyncThunk(
  'permissionApi/findPermissionTypes',
  async (_, {dispatch}) => {
    const {data} = await findAllDictionaryChildren({code:"permissionType"});
    return data
  }
)

const initPermissionState = {
  permissionList: {
    loading: false,
    data: [] as ResPermission[]
  },
  typeList:{
    loading: false,
    data: [] as ResDictionary[]
  }
}

export const permissionSlice = createSlice({
  name: "permission",
  initialState: initPermissionState,
  reducers: {
    syncPermissionList: (state, action) => {
      state.permissionList = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(asyncPermissionList.pending, (state, action) => {
        state.permissionList.loading = true
      })
      .addCase(asyncPermissionList.fulfilled, (state, action) => {
        state.permissionList.loading = false
        state.permissionList.data = action.payload
      })
      .addCase(asyncPermissionList.rejected, (state, action) => {
        state.permissionList.loading = false
        state.permissionList.data = []
      })
      // type list
      .addCase(asyncPermissionTypes.pending, (state, action) => {
        state.typeList.loading = true
      })
      .addCase(asyncPermissionTypes.fulfilled, (state, action) => {
        state.typeList.loading = false
        state.typeList.data = action.payload
      })
      .addCase(asyncPermissionTypes.rejected, (state, action) => {
        state.typeList.loading = false
        state.typeList.data = []
      })
  }
})

export const {syncPermissionList} = permissionSlice.actions
export const selectPermissionList = (state: any): typeof initPermissionState["permissionList"] => state.permission.permissionList

export default permissionSlice.reducer;