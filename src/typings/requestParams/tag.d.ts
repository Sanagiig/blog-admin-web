type ReqAddTagBody = {
  name: string;
  type: string;
  description: string;
}

type ReqFindTagBody = {
  id?: string;
  role?:string[];
  name?: string;
  type?: string;
  description?: string;
}

type ReqUpdateTagBody = ReqAddTagBody & {
  id: string;
}

type ReqFindTagPagingBody = FindTagBody & ReqPaging

type ReqDeleteTagBody = {
  ids:string[]
}