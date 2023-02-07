import request from "../request/index";

export function addCategory(data: ReqAddCategoryBody) {
  return request.post("/api/category/add", data);
}

export function updateCategory(data: ReqUpdateCategoryBody) {
  return request.post("/api/category/update", data);
}

export function findCategory(params: ReqFindCategoryBody) {
  return request.get<ResponseInfo<ResCategoryDetail>>("/api/category/find", {params});
}

export function findCategoryList(data: ReqFindCategoryBody) {
  return request.post<ResponseList<ResCategory>>("/api/category/findList", data);
}

export function findCategoryPaging(data: ReqFindCategoryPagingBody) {
  return request.post<ResponseTable<ResCategoryPaging>>("/api/category/findPaging", data);
}

export function findAllCategoryTree() {
  return request.get("/api/category/findAllTree");
}

export function findAllCategoryParent(data: ReqFindCategoryRelationShip) {
  return request.post("/api/category/delete", data);
}

export function findAllCategoryChildren(data: ReqFindCategoryRelationShip) {
  return request.post("/api/category/delete", data);
}

export function deleteCategory(data: ReqDeleteCategoryBody) {
  return request.post("/api/category/delete", data);
}
