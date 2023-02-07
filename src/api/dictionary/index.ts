import request from "../request/index";

export function addDictionary(data: ReqAddDictionaryBody) {
  return request.post("/api/dictionary/add", data);
}

export function updateDictionary(data: ReqUpdateDictionaryBody) {
  return request.post("/api/dictionary/update", data);
}

export function findDictionary(params: ReqFindDictionaryBody) {
  return request.get<ResponseInfo<ResDictionaryDetail>>("/api/dictionary/find", {params});
}

export function findDictionaryList(data: ReqFindDictionaryBody) {
  return request.post<ResponseList<ResDictionary>>("/api/dictionary/findList", data);
}

export function findDictionaryPaging(data: ReqFindDictionaryPagingBody) {
  return request.post<ResponseTable<ResDictionaryPaging>>("/api/dictionary/findPaging", data);
}

export function deleteDictionary(data: ReqDeleteDictionaryBody) {
  return request.post("/api/dictionary/delete", data);
}

export function findAllDictionaryTree() {
  return request.get("/api/dictionary/findAllTree");
}

export function findAllDictionaryParent(params: ReqFindDictionaryBody) {
  return request.get("/api/dictionary/findAllParent", {params});
}

export function findDictionaryChildren(params: ReqFindDictionaryBody) {
  return request.get("/api/dictionary/findChildren", {params});
}

export function findAllDictionaryChildren(params: ReqFindDictionaryBody) {
  return request.get("/api/dictionary/findAllChildren", {params});
}