type ResArticle = {
  id: string;
  title: string;
  author:ResUserBaseInfo;
  tags: ResTag[];
  category: ResCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type ResArticleDetail = {
  id: string;
  title: string;
  author:ResUserBaseInfo;
  tags: ResTag[];
  category: ResCategory;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type ResArticlePaging = ResArticle
