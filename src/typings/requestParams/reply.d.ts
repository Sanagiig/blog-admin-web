type ReqAddReplyBody = {
  name: string;
  type: string;
  description: string;
}

type ReqFindReplyBody = {
  id?: string;
  name?: string;
  type?: string[];
  description?: string;
}

type ReqUpdateReplyBody = ReqAddReplyBody & {
  id: string;
}

type ReqFindReplyPagingBody = FindReplyBody & ReqPaging


type ReqDeleteReplyBody = {
  ids:string[]
}