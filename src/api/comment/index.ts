import request from "../request/index";

export function addComment(data: ReqAddCommentBody) {
  return request.post("/api/comment/add", data);
}

export function updateComment(data: ReqUpdateCommentBody) {
  return request.post("/api/comment/update", data);
}

export function findComment(params: ReqFindCommentBody) {
  return request.get<ResponseInfo<ResCommentDetail>>("/api/comment/find", {params});
}

export function findCommentList(data: ReqFindCommentBody) {
  return request.post<ResponseList<ResComment>>("/api/comment/findList", data);
}

export function findCommentPaging(data: ReqFindCommentPagingBody) {
  return request.post<ResponseTable<ResCommentPaging>>("/api/comment/findPaging", data);
}

export function deleteComment(data: ReqDeleteCommentBody) {
  return request.post("/api/comment/delete", data);
}
