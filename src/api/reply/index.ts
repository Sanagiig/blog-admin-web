import request from "../request/index";

export function addReply(data: ReqAddReplyBody) {
  return request.post("/api/reply/add", data);
}

export function updateReply(data: ReqUpdateReplyBody) {
  return request.post("/api/reply/update", data);
}

export function findReply(params: ReqFindReplyBody) {
  return request.get<ResponseInfo<ResReplyDetail>>("/api/reply/find", {params});
}

export function findReplyList(data: ReqFindReplyBody) {
  return request.post<ResponseList<ResReply>>("/api/reply/findList", data);
}

export function findReplyPaging(data: ReqFindReplyPagingBody) {
  return request.post<ResponseTable<ResReplyPaging>>("/api/reply/findPaging", data);
}

export function deleteReply(data: ReqDeleteReplyBody) {
  return request.post("/api/reply/delete", data);
}
