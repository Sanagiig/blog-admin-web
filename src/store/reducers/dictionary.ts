import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {findAllDictionaryTree} from "@/api/dictionary";
import {findNode} from "@/utils/tree";

export const asyncDictionaryTree = createAsyncThunk(
  'dictionaryApi/findDictionaryAllTree',
  async (_, {dispatch}) => {
    const {data} = await findAllDictionaryTree();
    return [{id: "", name: "所有节点", children: data}] as ResDictionaryTree[]
  }
)

const initDictionaryState = {
  dictionaryTree: {
    loading: false,
    data: [] as ResDictionaryTree[]
  }
}

export const dictionarySlice = createSlice({
  name: "dictionary",
  initialState: initDictionaryState,
  reducers: {
    syncDictionaryTree: (state, action) => {
      const {id, data} = action.payload
      console.log("id", data, id)
      if (id) {
        const node = findNode(state.dictionaryTree.data, {id})
        if (node) {
          node.children = data
          return
        }
      }
      state.dictionaryTree.data = data
    },
  },
  extraReducers(builder) {
    builder
      .addCase(asyncDictionaryTree.pending, (state, action) => {
        state.dictionaryTree.loading = true
      })
      .addCase(asyncDictionaryTree.fulfilled, (state, {meta, payload}) => {
        state.dictionaryTree.loading = false
        state.dictionaryTree.data = payload
      })
      .addCase(asyncDictionaryTree.rejected, (state, action) => {
        state.dictionaryTree.loading = false
        state.dictionaryTree.data = []
      })
  }
})

export const {syncDictionaryTree} = dictionarySlice.actions
export const selectDictionaryTree = (state: any): typeof initDictionaryState["dictionaryTree"] => state.dictionary.dictionaryTree

export default dictionarySlice.reducer;