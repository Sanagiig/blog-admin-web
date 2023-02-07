import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {findAllCategoryTree} from "@/api/category";
import {findDictionaryChildren} from "@/api/dictionary";

export const asyncCategoryTree = createAsyncThunk(
  'categoryApi/findCategoryAllTree',
  async (_, {dispatch}) => {
    const {data} = await findAllCategoryTree();
    return [{id: "", name: "所有节点", children: data}] as ResCategoryTree[]
  }
)

export const asyncCategoryTypes = createAsyncThunk(
  'categoryApi/findTypes',
  async (_, {dispatch}) => {
    const {data} = await findDictionaryChildren({code: "categoryType"});
    return data
  }
)

const initCategoryState = {
  categoryTree: {
    loading: false,
    data: [] as ResCategoryTree[]
  },
  typeList: {
    loading: false,
    data: [] as ResDictionary[]
  }
}

export const categorySlice = createSlice({
  name: "category",
  initialState: initCategoryState,
  reducers: {
    syncCategoryTree: (state, action) => {
      const {id, data} = action.payload
      state.categoryTree.data = data
    },
  },
  extraReducers(builder) {
    builder
      .addCase(asyncCategoryTree.pending, (state, action) => {
        state.categoryTree.loading = true
      })
      .addCase(asyncCategoryTree.fulfilled, (state, {meta, payload}) => {
        state.categoryTree.loading = false
        state.categoryTree.data = payload
      })
      .addCase(asyncCategoryTree.rejected, (state, action) => {
        state.categoryTree.loading = false
        state.categoryTree.data = []
      })
      // type list
      .addCase(asyncCategoryTypes.pending, (state, action) => {
        state.typeList.loading = true
      })
      .addCase(asyncCategoryTypes.fulfilled, (state, action) => {
        state.typeList.loading = false
        state.typeList.data = action.payload
      })
      .addCase(asyncCategoryTypes.rejected, (state, action) => {
        state.typeList.loading = false
        state.typeList.data = []
      })
  }
})

export const {syncCategoryTree} = categorySlice.actions
export const selectCategoryTypeList = (state: any): typeof initCategoryState["typeList"] => state.category.typeList
export const selectCategoryTree = (state: any): typeof initCategoryState["categoryTree"] => state.category.categoryTree

export default categorySlice.reducer;