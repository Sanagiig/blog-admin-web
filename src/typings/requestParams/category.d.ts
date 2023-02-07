type ReqAddCategoryBody = {
  parentID?: string;
  name: string;
  type: string;
  description: string;
}

type ReqFindCategoryBody = {
  id?: string;
  parentID?:string;
  name?: string;
  type?: string[];
  description?: string;
}

type ReqUpdateCategoryBody = ReqAddCategoryBody & {
  id: string;
}

type ReqFindCategoryPagingBody = FindCategoryBody & ReqPaging

type ReqFindCategoryRelationShip = {
  id:string
}

type ReqDeleteCategoryBody = {
  ids:string[]
}