type ReqAddArticleBody = {
  title: string;
  tags: string[];
  category: string;
  description: string;
  content: string;
}

type ReqFindArticleBody = {
  id?: string;
  title?: string;
  tags?: string[];
  categories?: string[];
  description?: string;
  content?: string;
}

type ReqUpdateArticleBody = ReqAddArticleBody & {
  id: string;
}

type ReqFindArticlePagingBody = ReqFindArticleBody & ReqPaging


type ReqDeleteArticleBody = {
  ids:string[]
}