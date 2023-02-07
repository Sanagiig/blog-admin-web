type ResComment = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

type ResCommentDetail = {
  id: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type ResCommentTree = ResComment & {
  children?: ResCommentTree[]
}

type ResCommentPaging = ResComment
