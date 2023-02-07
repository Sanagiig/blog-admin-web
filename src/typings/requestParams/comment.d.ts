type ReqAddCommentBody = {
  name: string;
  type: string;
  description: string;
}

type ReqFindCommentBody = {
  id?: string;
  name?: string;
  type?: string[];
  description?: string;
}

type ReqUpdateCommentBody = ReqAddCommentBody & {
  id: string;
}

type ReqFindCommentPagingBody = FindCommentBody & ReqPaging


type ReqDeleteCommentBody = {
  ids:string[]
}