import request from "../request/index";

export function addArticle(data: ReqAddArticleBody) {
  return request.post("/api/article/add", data);
}

export function updateArticle(data: ReqUpdateArticleBody) {
  return request.post("/api/article/update", data);
}

export function findArticle(params: ReqFindArticleBody) {
  return request.get<ResponseInfo<ResArticleDetail>>("/api/article/find", {params});
}

export function findArticleList(data: ReqFindArticleBody) {
  return request.post<ResponseList<ResArticle>>("/api/article/findList", data);
}

export function findArticlePaging(data: ReqFindArticlePagingBody) {
  return request.post<ResponseTable<ResArticlePaging>>("/api/article/findPaging", data);
}

export function deleteArticle(data: ReqDeleteArticleBody) {
  return request.post("/api/article/delete", data);
}
