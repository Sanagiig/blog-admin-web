import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {findSelfInfo} from "@/api/user"

export const asyncSelfInfo = createAsyncThunk(
  'userApi/findUserList',
  async (_, {dispatch}) => {
    const {data} = await findSelfInfo();
    return data
  }
)

const initUserState = {
  userInfo: {
    loading: false,
    data: {} as ResUserDetailInfo
  }
}
export const userSlice = createSlice({
  name: "user",
  initialState: initUserState,
  reducers: {
    syncSelfInfo: (state, action) => {
      state.userInfo.data = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(asyncSelfInfo.pending, (state, action) => {
      state.userInfo.loading = true
    }).addCase(asyncSelfInfo.fulfilled, (state, action) => {
      state.userInfo.loading = false
      state.userInfo.data = action.payload
    }).addCase(asyncSelfInfo.rejected, (state, action) => {
      state.userInfo.loading = false
      state.userInfo.data = {} as any
    })
  }
})


export const {syncSelfInfo} = userSlice.actions
export const selectSelfInfo = (state: any): typeof initUserState["userInfo"] => state.user.userInfo

export default userSlice.reducer;