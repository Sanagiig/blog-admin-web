import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {findTagList} from "@/api/tag";
import { findDictionaryChildren} from "@/api/dictionary";

export const asyncTagList = createAsyncThunk(
  'tagApi/findTagList',
  async (params: ReqFindRoleBody, {dispatch}) => {
    const {data} = await findTagList(params);
    return data
  }
)

export const asyncTagTypes = createAsyncThunk(
  'tagApi/findTypes',
  async (_, {dispatch}) => {
    const {data} = await findDictionaryChildren({code:"tagType"});
    return data
  }
)

const initTagState = {
  tagList: {
    loading: false,
    data: [] as ResTag[]
  },
  typeList:{
    loading: false,
    data: [] as ResDictionary[]
  }
}

export const tagSlice = createSlice({
  name: "tag",
  initialState: initTagState,
  reducers: {
    syncTagList: (state, action) => {
      state.tagList = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(asyncTagList.pending, (state, action) => {
        state.tagList.loading = true
      })
      .addCase(asyncTagList.fulfilled, (state, action) => {
        state.tagList.loading = false
        state.tagList.data = action.payload
      })
      .addCase(asyncTagList.rejected, (state, action) => {
        state.tagList.loading = false
        state.tagList.data = []
      })
      // type list
      .addCase(asyncTagTypes.pending, (state, action) => {
        state.typeList.loading = true
      })
      .addCase(asyncTagTypes.fulfilled, (state, action) => {
        state.typeList.loading = false
        state.typeList.data = action.payload
      })
      .addCase(asyncTagTypes.rejected, (state, action) => {
        state.typeList.loading = false
        state.typeList.data = []
      })
  }
})

export const {syncTagList} = tagSlice.actions
export const selectTagList = (state: any): typeof initTagState["tagList"] => state.tag.tagList
export const selectTagTypeList = (state: any): typeof initTagState["typeList"] => state.tag.typeList

export default tagSlice.reducer;