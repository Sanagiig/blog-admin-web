import request from "../request/index";

export function addTag(data: ReqAddTagBody) {
  return request.post("/api/tag/add", data);
}

export function updateTag(data: ReqUpdateTagBody) {
  return request.post("/api/tag/update", data);
}

export function findTag(params: ReqFindTagBody) {
  return request.get<ResponseInfo<ResTagDetail>>("/api/tag/find", {params});
}

export function findTagList(data: ReqFindTagBody) {
  return request.post<ResponseList<ResTag>>("/api/tag/findList", data);
}

export function findTagPaging(data: ReqFindTagPagingBody) {
  return request.post<ResponseTable<ResTagPaging>>("/api/tag/findPaging", data);
}

export function deleteTag(data: ReqDeleteTagBody) {
  return request.post("/api/tag/delete", data);
}
